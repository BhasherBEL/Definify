import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';
import { safeRedirectAuto } from '@bhasher/svelte-auth';

export async function POST({ locals, request, cookies, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'Forbidden');
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		return error(400, 'Bad request');
	}

	if (password.length < 8) return error(400, 'Password must be at least 8 characters');
	if (password.length > 256) return error(400, 'Password must be less than 256 characters');

	if (!(await auth.checkEmail(email))) {
		return error(400, 'Email already in use');
	}

	let userId;
	try {
		userId = await auth.registerUser(email);
		await auth.registerPassword(userId, password);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		return error(400, e);
	}

	return safeRedirectAuto(url);
}
