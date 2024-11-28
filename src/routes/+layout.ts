import { loadTranslations, locale } from '$lib/translations';
import type { User } from '@bhasher/svelte-auth';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url, data }) => {
	const { pathname } = url;

	const user: User | null = data?.user;

	const initLocale = 'en';

	await loadTranslations(initLocale, pathname);

	return { user, locale };
};
