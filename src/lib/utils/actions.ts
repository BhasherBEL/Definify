import { fail, type RequestEvent, redirect } from '@sveltejs/kit';
import { safeRedirectAuto } from '$lib/utils/security';
import { safeRedirect } from '$lib/utils/security';
import auth from '$lib/server/auth';

export async function defaultLoginAction({ locals, request, url, fetch }: RequestEvent) {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');
	if (!email || !password) {
		return fail(400, { invalid: true });
	}

	const resp = await fetch('/api/login/passwords', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	if (!resp.ok) {
		return fail(401, { incorrect: true });
	}

	safeRedirectAuto(url);
}

export async function defaultLogoutAction({ locals, cookies, url }: RequestEvent) {
	if (!locals.session) {
		return fail(401);
	}
	await auth.invalidateSession(cookies, locals.session.id);

	const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
	return redirect(302, redirectUrl);
}
