import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';

export async function POST({ locals, request, cookies }: RequestEvent) {
	if (locals.user) {
		return json({});
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

	return json({});
}
