import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { getUserByUsername } from '$lib/server/db/users';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const redirectUrl = url.searchParams.get('redirect') || '/';
		return redirect(302, redirectUrl);
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, url, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!auth.validateUsername(username)) {
			return fail(400, { invalid: true, username: true });
		}
		if (!auth.validatePassword(password)) {
			return fail(400, { invalid: true, password: true });
		}

		const existingUser = await getUserByUsername(username);
		if (!existingUser) {
			return fail(400, { incorrect: true });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { incorrect: true });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

		const redirectUrl = url.searchParams.get('redirect') || '/';
		return redirect(302, redirectUrl);
	}
};
