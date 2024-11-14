import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	words: many(usersWords)
}));

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const words = sqliteTable('words', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	word: text('word').notNull().unique(),
	definition: text('definition').notNull()
});

export const usersWords = sqliteTable(
	'users_words',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		wordId: integer('word_id')
			.notNull()
			.references(() => words.id)
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

export type Word = typeof words.$inferSelect;
