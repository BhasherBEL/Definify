import { searchDictionary } from '$lib/dictionnary';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	search: async ({ request }) => {
		const formData = await request.formData();
		const word = formData.get('search');
		if (!word) {
			return fail(400, { invalid: true });
		}

		const apiResponse = await searchDictionary(word as string);

		if (!apiResponse) {
			return fail(404, { apiError: true });
		}

		if (apiResponse.title === 'No Definitions Found') {
			return fail(404, { notFound: true, word });
		}

		return {
			definition: apiResponse,
			word
		};
	}
};
