import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getOrInsertWord, getSuggestedWords } from '$lib/server/db/words';
import type { Word } from '$lib/server/db/schema';

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export const load: PageServerLoad = async ({}) => {
	const suggestions: Word[] = await getSuggestedWords(5);

	const simplified = suggestions.map((w) => {
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

	return {
		suggestions: simplified
	};
};

export const actions: Actions = {
	search: async ({ request }) => {
		const formData = await request.formData();
		const word = formData.get('search');
		if (!word) {
			return fail(400, { invalid: true });
		}

		const wordApi = await getOrInsertWord(word?.toString());

		if (!wordApi) {
			return fail(404, { notFound: true, word });
		}

		redirect(302, `/words/${word}`);
	}
};
