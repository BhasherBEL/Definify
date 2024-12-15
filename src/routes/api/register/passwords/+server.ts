import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';
import { safeRedirectAuto } from '@bhasher/svelte-auth';
import analytics from '$lib/server/analytics';

export async function POST(event: RequestEvent) {
	const { locals, request, cookies, url } = event;
	if (locals.user) {
		analytics.trackPlausibleRegister(event, 'password', 'already-logged-in').catch(console.warn);
		return error(403, 'Forbidden');
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		analytics.trackPlausibleRegister(event, 'password', 'bad-request').catch(console.warn);
		return error(400, 'Bad request');
	}

	if (password.length < 8) {
		analytics.trackPlausibleRegister(event, 'password', 'password-too-short').catch(console.warn);
		return error(400, 'Password must be at least 8 characters');
	}
	if (password.length > 256) {
		analytics.trackPlausibleRegister(event, 'password', 'password-too-long').catch(console.warn);
		return error(400, 'Password must be less than 256 characters');
	}

	if (!(await auth.checkEmail(email))) {
		analytics.trackPlausibleRegister(event, 'password', 'email-already-in-use').catch(console.warn);
		return error(400, 'Email already in use');
	}

	let userId;
	try {
		userId = await auth.registerUser(email);
		await auth.registerPassword(userId, password);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		analytics.trackPlausibleRegister(event, 'password', 'failed').catch(console.warn);
		return error(400, e);
	}

	analytics.trackPlausibleRegister(event, 'password', 'success').catch(console.warn);
	return safeRedirectAuto(url);
}
