import { loadTranslations, locale } from '$lib/translations';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url, data }) => {
	const { pathname } = url;

	const initLocale = navigator.language || 'en';

	await loadTranslations(initLocale, pathname);

	return { ...data, locale };
};
