import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';
import { safeRedirectAuto } from '$lib/utils/security';

export async function POST({ locals, request, cookies, url }: RequestEvent) {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		return error(400, 'Bad request');
	}

	try {
		const userId = await auth.loginEmailPassword(email, password);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		return error(400, "Couldn't log in");
	}

	return safeRedirectAuto(url);
}
