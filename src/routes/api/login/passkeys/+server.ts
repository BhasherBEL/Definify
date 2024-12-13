import { error, json, type RequestEvent } from '@sveltejs/kit';
import auth from '$lib/server/auth';
import { safeRedirectAuto } from '@bhasher/svelte-auth';

export async function GET({ locals, url }: RequestEvent) {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	try {
		return json(await auth.getLoginPasskeyOptions());
	} catch (e: any) {
		console.log(e);
		return error(400, "Couldn't get login options");
	}
}

export async function POST({ locals, cookies, request, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const { rid, response } = await request.json();

	let userId: string;
	try {
		userId = await auth.verifyLoginPasskeyResponse(rid, response);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		return error(400, "Couldn't log in");
	}

	return safeRedirectAuto(url);
}
