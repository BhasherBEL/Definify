import { eq, sql } from 'drizzle-orm';
import type { Word } from './schema';
import * as table from './schema';
import { db } from '.';
import { searchDictionary } from '$lib/dictionnary';

const DEFINIFY = {
	id: -1,
	word: 'Definify',
	definition: [
		{
			word: 'definify',
			meanings: [
				{
					partOfSpeech: 'noun',
					definitions: [{ definition: 'Well... Just take a look around!' }]
				}
			],
			sourceUrls: ['https://github.com/bhasherbel/definify', 'https://definify.vercel.app']
		}
	] as any,
	createdAt: new Date(2024, 11, 14, 12, 59, 59),
	updatedAt: new Date()
};

export async function getOrInsertWord(word: string): Promise<Word | null> {
	word = word.trim().toLowerCase();

	if (!word) return null;

	if (word === 'definify') {
		return DEFINIFY;
	}

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

	return {
		id: wordDb.id,
		word: wordDb.word,
		definition: JSON.parse(wordDb.definition),
		createdAt: wordDb.createdAt,
		updatedAt: wordDb.updatedAt
	};
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

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export type SuggestedWord = {
	id: number;
	word: string;
	definition: string;
	partOfSpeech: string;
};

export async function getSuggestedWords(amount: number): Promise<SuggestedWord[]> {
	const suggestions = await db
		.select()
		.from(table.words)
		.orderBy(sql`random()`)
		.limit(amount);

	if (Math.random() > 0.7) {
		suggestions[getRandomInt(suggestions.length)] = {
			...DEFINIFY,
			definition: JSON.stringify(DEFINIFY.definition)
		};
	}

	return suggestions.map((w) => {
		const words = JSON.parse(w.definition);
		const word = words[getRandomInt(words.length)];
		const meaning = word.meanings[getRandomInt(word.meanings.length)];
		const definition = meaning.definitions[getRandomInt(meaning.definitions.length)].definition;

		return {
			id: w.id,
			word: word.word,
			definition,
			partOfSpeech: meaning.partOfSpeech
		};
	});
}
