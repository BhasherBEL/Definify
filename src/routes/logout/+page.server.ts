import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { safeRedirect } from '$lib/utils/security';

export const actions: Actions = {
	default: async ({ locals, cookies, url }) => {
		if (!locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(locals.session.id);
		auth.deleteSessionTokenCookie(cookies);

		const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
		return redirect(302, redirectUrl);
	}
};
