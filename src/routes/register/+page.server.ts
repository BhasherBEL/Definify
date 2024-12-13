import type { PageServerLoad } from './$types';
import { safeRedirectAuto } from '@bhasher/svelte-auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		return safeRedirectAuto(url);
	}
	return {};
};
