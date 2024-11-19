import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { safeRedirect } from '$lib/utils/security';
import auth from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ locals, cookies, url }) => {
		if (!locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(cookies, locals.session.id);

		const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
		return redirect(302, redirectUrl);
	}
};
