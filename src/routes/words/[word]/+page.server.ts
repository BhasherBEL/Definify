import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { getOrInsertWord } from '$lib/server/db/words';

export const load: PageServerLoad = async ({ locals, params }) => {
	const word = params.word;

	if (!word) return redirect(302, '/');

	const wordApi = await getOrInsertWord(word.toString());

	if (!wordApi) {
		return error(404, 'Word not found');
	}

	if (!locals.user) {
		return {
			user: locals.user,
			definition: wordApi.definition,
			word,
			saved: false
		};
	}

	const isSaved = await db.query.usersWords.findFirst({
		where: and(
			eq(tables.usersWords.userId, locals.user.id),
			eq(tables.usersWords.wordId, wordApi.id)
		)
	});

	return {
		user: locals.user,
		word,
		definition: wordApi.definition,
		saved: !!isSaved
	};
};
