import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';
import analytics from '$lib/server/analytics';

export async function POST(event: RequestEvent) {
	const { locals, request, cookies, url } = event;

	if (locals.user) {
		analytics.trackPlausibleLogin(event, 'password', 'already-logged-in').catch(console.warn);
		return json({});
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		analytics.trackPlausibleLogin(event, 'password', 'bad-request').catch(console.warn);
		return error(400, 'Bad request');
	}

	try {
		const userId = await auth.loginEmailPassword(email, password);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		analytics.trackPlausibleLogin(event, 'password', 'failed').catch(console.warn);
		return error(400, "Couldn't log in");
	}

	analytics.trackPlausibleLogin(event, 'password', 'success').catch(console.warn);
	return json({});
}
