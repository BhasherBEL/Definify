import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import auth from '$lib/server/auth';

export async function POST({ locals, request, cookies }: RequestEvent) {
	if (locals.user) {
		return error(403, 'Forbidden');
	}

	const { email, password } = await request.json();

	if (!email || !password) {
		return error(400, 'Bad request');
	}

	let userId;
	try {
		userId = await auth.registerUser(email);
		await auth.registerPassword(userId, password);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		return error(400, e);
	}

	return json({ id: userId }, { status: 201 });
}
