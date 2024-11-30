import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getOrInsertWord, getSuggestedWords } from '$lib/server/db/words';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import * as tables from '$lib/server/db/schema';

export const load: PageServerLoad = async ({}) => {
	const suggestions = await getSuggestedWords(3);

	return {
		suggestions
	};
};

export const actions: Actions = {
	search: async ({ request, locals }) => {
		const formData = await request.formData();
		let word = formData.get('search')?.toString().trim().toLowerCase();
		if (!word) {
			return fail(400, { invalid: true });
		}

		const wordApi = await getOrInsertWord(word?.toString());

		if (!wordApi) {
			return fail(404, { notFound: true, word });
		}

		if (!locals.user) {
			return {
				searchResult: {
					definition: wordApi.definition,
					word,
					saved: false
				}
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
	},

	suggestions: async () => {
		return {};
	}
};
