import type { PageServerLoad } from './$types';
import { safeRedirectAuto } from '$lib/utils/security';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	return {};
};
