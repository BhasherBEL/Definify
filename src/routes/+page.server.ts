import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import * as tables from '$lib/server/db/schema';
import { getOrInsertWord } from '$lib/server/db/words';

export const actions: Actions = {
	search: async ({ locals, request }) => {
		const formData = await request.formData();
		const word = formData.get('search');
		if (!word) {
			return fail(400, { invalid: true });
		}

		const wordApi = await getOrInsertWord(word?.toString());

		if (!wordApi) {
			return fail(404, { notFound: true, word });
		}

		if (!locals.user) {
			return {
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
			word,
			definition: wordApi.definition,
			saved: !!isSaved
		};
	}
};
