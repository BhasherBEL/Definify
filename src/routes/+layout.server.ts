import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const { user, theme } = locals;

	return { user, theme };
};
