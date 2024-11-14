import { error } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { getWord } from '$lib/server/db/words';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function DELETE({ locals, params }: RequestEvent) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const word = params.word;

	if (!word) return error(400, 'Bad Request');

	const wordDb = await getWord(word);

	if (!wordDb) {
		return error(404, 'Unknown word');
	}

	await db
		.delete(table.usersWords)
		.where(
			and(eq(table.usersWords.userId, locals.user.id), eq(table.usersWords.wordId, wordDb.id))
		);

	return new Response(undefined, { status: 204 });
}
