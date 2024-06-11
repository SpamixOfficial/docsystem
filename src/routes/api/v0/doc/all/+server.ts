import { db } from '$lib/db.server.js';
import { json } from '@sveltejs/kit';
import { documents } from '$lib/schema.server.js';

export async function GET({ request, url }) {
    try {
	let password: string | any = request.headers.get('Authorization');
	let master_password: string | any = Bun.env.master_password;
	let hash: string | any = await Bun.password.hash(master_password);
	if (!hash) throw new Error('No verify hash');
	const isMatch = await Bun.password.verify(password, hash);
	if (!isMatch) throw new Error('Authentication failed');

	let db_content = await db.select({
		id: documents.id,
		protected: documents.password_protected
	}).from(documents);
    return json(db_content, {
        status: 200
    })
    } catch (error: Error | any) {
		console.log(`!¡!¡ Server ran into an error:\n${error}`);
		switch (error.message) {
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
