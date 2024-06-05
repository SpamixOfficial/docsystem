import { mediumtext, mysqlTable, varchar, boolean } from 'drizzle-orm/mysql-core';

export const documents = mysqlTable('documents', {
	id: varchar('id', { length: 10 }).notNull(),
	content: mediumtext('content'),
	password_protected: boolean('password_protected').default(false),
	password_hash: varchar('password_hash', { length: 128 }).default("").notNull()
});

export const publicDocumentProjection = {
    id: documents.id,
    content: documents.id,
    password_protected: documents.password_protected,
    password_hash: documents.password_hash
}