import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { Passkey, Session, User, Password } from '@bhasher/svelte-auth';

const timestamp = {
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
};

export const users = sqliteTable('users', User.getSqliteColumnsMap(), User.getSqliteColumnsConfig);

export const usersRelations = relations(users, ({ many, one }) => ({
	words: many(usersWords),
	password: one(passwords, {
		fields: [users.id],
		references: [passwords.userId]
	}),
	passkeys: many(passkeys)
}));

export const passwords = sqliteTable(
	'passwords',
	Password.getSqliteColumnsMap(users),
	Password.getSqliteColumnsConfig
);

export const sessions = sqliteTable(
	'sessions',
	Session.getSqliteColumnsMap(users),
	Session.getSqliteColumnsConfig
);

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const passkeys = sqliteTable(
	'passkeys',
	Passkey.getSqliteColumnsMap(users),
	Passkey.getSqliteColumnsConfig
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

export type Word = typeof words.$inferSelect;
