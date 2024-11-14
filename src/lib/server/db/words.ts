import { eq } from 'drizzle-orm';
import type { Word } from './schema';
import * as table from './schema';
import { db } from '.';
import { searchDictionary } from '$lib/dictionnary';

export async function getOrInsertWord(word: string): Promise<Word | null> {
	if (!word) return null;

	let wordDb = await db.query.words.findFirst({
		where: eq(table.words.word, word)
	});

	if (wordDb) {
		wordDb.definition = JSON.parse(wordDb.definition);
		return wordDb;
	}

	const definitions = await searchDictionary(word);

	if (!definitions || definitions.title === 'No Definitions Found') return null;

	wordDb = await db
		.insert(table.words)
		.values({
			word: word,
			definition: JSON.stringify(definitions)
		})
		.onConflictDoNothing()
		.returning()
		.get();

	if (!wordDb) return null;

	wordDb.definition = JSON.parse(wordDb.definition);
	return wordDb;
}

export async function getWord(word: string): Promise<Word | null> {
	if (!word) return null;
	let wordDb = await db.query.words.findFirst({
		where: eq(table.words.word, word)
	});
	if (wordDb) {
		wordDb.definition = JSON.parse(wordDb.definition);
		return wordDb;
	}
	return null;
}
