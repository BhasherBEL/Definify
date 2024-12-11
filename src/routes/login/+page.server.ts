import type { PageServerLoad } from './$types';
import { safeRedirectAuto } from '$lib/utils/security';
import { type Actions } from '@sveltejs/kit';
import { defaultLoginAction } from '$lib/utils/actions';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	return {};
};

export const actions: Actions = {
	default: defaultLoginAction
} satisfies Actions;
