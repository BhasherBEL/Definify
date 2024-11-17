import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey, blob, unique } from 'drizzle-orm/sqlite-core';
import { customUint8Array } from './types';

const timestamp = {
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
};

export const users = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash')
});

export const usersRelations = relations(users, ({ many }) => ({
	words: many(usersWords),
	passkeys: many(passkeys)
}));

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const passkeys = sqliteTable(
	'passkeys',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		publicKey: customUint8Array('public_key').notNull(),
		webauthnUserId: text('webauthn_user_id').notNull(),
		counter: integer('counter').notNull(),
		transports: text('transports').notNull(),
		...timestamp
	},
	(t) => ({ unq: unique().on(t.userId, t.webauthnUserId) })
);

export const passskeysRelations = relations(passkeys, ({ one }) => ({
	user: one(users, {
		fields: [passkeys.userId],
		references: [users.id]
	})
}));

export const words = sqliteTable('words', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	word: text('word').notNull().unique(),
	definition: text('definition').notNull(),
	...timestamp
});

export const usersWords = sqliteTable(
	'users_words',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		wordId: integer('word_id')
			.notNull()
			.references(() => words.id),
		...timestamp
	},
	(t) => ({ pk: primaryKey({ columns: [t.wordId, t.userId] }) })
);

export const usersWordsRelations = relations(usersWords, ({ one }) => ({
	user: one(users, {
		fields: [usersWords.userId],
		references: [users.id]
	}),
	word: one(words, {
		fields: [usersWords.wordId],
		references: [words.id]
	})
}));

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;

export type Passkey = typeof passkeys.$inferSelect;

export type Word = typeof words.$inferSelect;
