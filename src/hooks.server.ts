import auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(event.cookies, sessionToken);

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
