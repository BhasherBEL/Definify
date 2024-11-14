import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { getOrInsertWord } from '$lib/server/db/words';

export async function GET({ locals }: RequestEvent) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const words = await db.query.usersWords.findMany({
		where: eq(table.usersWords.userId, locals.user.id),
		with: {
			word: true
		}
	});

	return json(words);
}

export async function POST({ locals, request }: RequestEvent) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	let { word } = await request.json();

	word = word.trim().toLowerCase();

	if (!word) {
		return error(400, 'Bad Request');
	}

	const wordDb = await getOrInsertWord(word);

	if (!wordDb) {
		return error(400, 'Unknown word');
	}

	await db
		.insert(table.usersWords)
		.values({
			userId: locals.user.id,
			wordId: wordDb.id
		})
		.onConflictDoNothing();

	return new Response(wordDb.id.toString(), { status: 201 });
}
