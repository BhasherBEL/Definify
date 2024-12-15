import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { validateEmail, type tempPasskey, safeRedirectAuto } from '@bhasher/svelte-auth';
import auth from '$lib/server/auth';
import analytics from '$lib/server/analytics';

export async function GET(event: RequestEvent) {
	const { locals, url } = event;
	if (locals.user) {
		analytics.trackPlausibleRegister(event, 'passkey', 'already-logged-in').catch(console.warn);
		return safeRedirectAuto(url);
	}

	const email = url.searchParams.get('email');
	if (!validateEmail(email)) {
		analytics.trackPlausibleRegister(event, 'passkey', 'invalid-email').catch(console.warn);
		return error(400, 'Invalid email');
	}

	if (!(await auth.checkEmail(email))) {
		analytics.trackPlausibleRegister(event, 'passkey', 'email-already-in-use').catch(console.warn);
		return error(400, 'Email already exists');
	}

	try {
		const options = json(await auth.getRegisterPasskeyOptions(email));
		analytics.trackPlausibleRegister(event, 'passkey', 'get-options').catch(console.warn);
		return options;
	} catch (e: any) {
		console.log(e);
		analytics.trackPlausibleRegister(event, 'passkey', 'get-options-failed').catch(console.warn);
		return error(400, "Couldn't get registration options");
	}
}

export async function POST(event: RequestEvent) {
	const { locals, request, cookies, url } = event;
	if (locals.user) {
		analytics.trackPlausibleRegister(event, 'passkey', 'already-logged-in').catch(console.warn);
		return error(403, 'You are already logged in');
	}

	const { email, response } = await request.json();

	if (!response || !email) {
		analytics.trackPlausibleRegister(event, 'passkey', 'bad-request').catch(console.warn);
		return error(400, 'Bad request');
	}

	let passkey: tempPasskey;

	try {
		passkey = await auth.verifyRegisterPasskeyResponse(email, response);
	} catch (e) {
		console.log(e);
		analytics.trackPlausibleRegister(event, 'passkey', 'bad-response').catch(console.warn);
		return error(400, 'Invalid registration response');
	}

	try {
		const userId = await auth.registerUser(email);
		await auth.savePasskey(passkey, userId);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		analytics.trackPlausibleRegister(event, 'passkey', 'failed').catch(console.warn);
		return error(400, 'Failed to register user');
	}

	analytics.trackPlausibleRegister(event, 'passkey', 'success').catch(console.warn);
	return safeRedirectAuto(url);
}
