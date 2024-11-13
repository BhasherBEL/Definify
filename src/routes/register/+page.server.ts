import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { hash } from '@node-rs/argon2';
import { createUser } from '$lib/server/db/users';

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
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		if (!auth.validateUsername(username)) {
			return fail(400, { invalid: true, username: true });
		}
		if (!auth.validateEmail(email)) {
			return fail(400, { invalid: true, email: true });
		}
		if (!auth.validatePassword(password)) {
			return fail(400, { invalid: true, password: true });
		}
		if (password !== confirmPassword) {
			return fail(400, { invalid: true, confirmPassword: true });
		}

		const userId = auth.generateUserId();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await createUser(userId, username, email, passwordHash);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
		} catch (e) {
			console.error(e);
			return fail(500, { error: true });
		}

		const redirectUrl = url.searchParams.get('redirect') || '/';
		return redirect(302, redirectUrl);
	}
};
