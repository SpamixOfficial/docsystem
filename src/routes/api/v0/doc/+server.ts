import { json } from '@sveltejs/kit';
import { db } from '$lib/db.server.js';
import { ulid } from '@0x57/ulid';
import { documents, publicDocumentProjection } from '$lib/schema.server.js';
import { eq } from 'drizzle-orm';

export async function GET({ request, url }) {
	try {
		let request_id: string | any = url.searchParams.get('id');
        let password: string | any = url.searchParams.get('password')
		if (!request_id) {
			throw new Error('No id specified');
		}
		let [id_exists] = await db
			.select({
				protected: documents.password_protected,
                phash: documents.password_hash
			})
			.from(documents)
			.where(eq(documents.id, request_id));
		if (id_exists === undefined) throw new Error('No id like that exists');
		if (id_exists.protected && !password) {
            throw new Error("Password Protected");
        };
        if (id_exists.protected) {
            let isMatch = await Bun.password.verify(password, id_exists.phash)
            if (isMatch != true) throw new Error("Wrong password");
        };
        let [document_content] = await db
        .select({
            content: documents.content
        })
        .from(documents)
        .where(eq(documents.id, request_id));
		return json(
				{
					content: document_content.content
				},
				{
					status: 200
				}
			);
	} catch (error: Error | any) {
        console.log(`!¡!¡ Server ran into an error:\n${error}`);
		switch (error.message) {
			case 'No id specified':
				return json(
					{
						error: error.message
					},
					{
						status: 400
					}
				);
			case 'No id like that exists':
				return json(
					{
						error: error.message
					},
					{
						status: 404
					}
				);
			case 'Password Protected':
            case 'Wrong password':
				return json(
					{
						error: error.message
					},
					{
						status: 403
					}
				);
			default:
				return json(
					{
						error: 'Unknown error, possibly on the server side'
					},
					{
						status: 500
					}
				);
		}
	}
}

export async function POST({ request }) {
	try {
		let password: string | any = request.headers.get('Authorization');
		let master_password: string | any = Bun.env.master_password;
		let hash: string | any = await Bun.password.hash(master_password);
		if (!hash) throw new Error('No verify hash');
		const isMatch = await Bun.password.verify(password, hash);
		if (!isMatch) throw new Error('Authentication failed');
		let jsonBody: Object | any = await request.json();
		if (!jsonBody || !jsonBody['content'] || Object.values(jsonBody).includes('password_protected'))
			throw new Error('Malformed body');
		if (jsonBody['password_protected'] == true && !jsonBody['password'])
			throw new Error('No password provided');
		let new_id: string | any;
		while (true) {
			new_id = ulid().substring(0, 10); // we use 10-character ID:s
			let [id_exists] = await db.select().from(documents).where(eq(documents.id, new_id));
			if (!id_exists) break;
		}
		if (jsonBody['password_protected'] == false) {
			await db
				.insert(documents)
				.values({ id: new_id, content: jsonBody['content'], password_protected: false });
		} else {
			let password_hash: string | any = await Bun.password.hash(jsonBody['password']);
			await db.insert(documents).values({
				id: new_id,
				content: jsonBody['content'],
				password_protected: true,
				password_hash
			});
		}
		return json({
            id: new_id
        }, { status: 200 });
	} catch (error: Error | any) {
        console.log(`!¡!¡ Server ran into an error:\n${error}`);
		switch (error.message) {
			case 'Malformed body':
			case 'No password provided':
				return json(
					{
						error: error.message
					},
					{
						status: 400
					}
				);
			case 'Authentication failed':
				return json(
					{
						error: error.message
					},
					{
						status: 403
					}
				);
			case 'No verify hash':
			default:
				return json(
					{
						error: 'Unknown error, possibly on the server side'
					},
					{
						status: 500
					}
				);
		}
	}
}
