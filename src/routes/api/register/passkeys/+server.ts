import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { safeRedirectAuto } from '$lib/utils/security';
import { validateEmail, type tempPasskey } from '@bhasher/svelte-auth';
import auth from '$lib/server/auth';

export async function GET({ locals, url }: RequestEvent) {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	const email = url.searchParams.get('email');
	if (!validateEmail(email)) {
		return error(400, 'Invalid email');
	}

	if (!(await auth.checkEmail(email))) {
		return error(400, 'Email already exists');
	}

	try {
		return json(await auth.getRegisterPasskeyOptions(email));
	} catch (e: any) {
		console.log(e);
		return error(400, "Couldn't get registration options");
	}
}

export async function POST({ locals, request, cookies, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const { email, response } = await request.json();

	if (!response || !email) {
		return error(400, 'Bad request');
	}

	let passkey: tempPasskey;

	try {
		passkey = await auth.verifyRegisterPasskeyResponse(email, response);
	} catch (e) {
		console.log(e);
		return error(400, 'Invalid registration response');
	}

	try {
		const userId = await auth.registerUser(email);
		await auth.savePasskey(passkey, userId);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		return error(400, 'Failed to register user');
	}

	return safeRedirectAuto(url);
}
