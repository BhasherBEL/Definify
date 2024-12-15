import { error, json, type RequestEvent } from '@sveltejs/kit';
import auth from '$lib/server/auth';
import { safeRedirectAuto } from '@bhasher/svelte-auth';
import analytics from '$lib/server/analytics';

export async function GET(event: RequestEvent) {
	const { locals, url } = event;

	if (locals.user) {
		analytics.trackPlausibleLogin(event, 'passkey', 'already-logged-in').catch(console.warn);
		return safeRedirectAuto(url);
	}

	try {
		analytics.trackPlausibleLogin(event, 'passkey', 'get-options').catch(console.warn);
		return json(await auth.getLoginPasskeyOptions());
	} catch (e: any) {
		console.log(e);
		analytics.trackPlausibleLogin(event, 'passkey', 'get-options-failed').catch(console.warn);
		return error(400, "Couldn't get login options");
	}
}

export async function POST(event: RequestEvent) {
	const { locals, cookies, request, url } = event;
	if (locals.user) {
		analytics.trackPlausibleLogin(event, 'passkey', 'already-logged-in').catch(console.warn);
		return error(403, 'You are already logged in');
	}

	const { rid, response } = await request.json();

	let userId: string;
	try {
		userId = await auth.verifyLoginPasskeyResponse(rid, response);
		await auth.initSession(cookies, userId);
	} catch (e: any) {
		console.log(e);
		analytics.trackPlausibleLogin(event, 'passkey', 'failed').catch(console.warn);
		return error(400, "Couldn't log in");
	}

	analytics.trackPlausibleLogin(event, 'passkey', 'success').catch(console.warn);
	return safeRedirectAuto(url);
}
