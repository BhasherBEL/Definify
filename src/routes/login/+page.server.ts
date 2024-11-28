import type { PageServerLoad } from './$types';
import { safeRedirectAuto } from '$lib/utils/security';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		return safeRedirectAuto(url);
	}

	return {};
};

export const actions: Actions = {
	default: async ({ locals, request, url, fetch }) => {
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

		console.log(resp);

		if (!resp.ok) {
			return fail(401, { incorrect: true });
		}

		safeRedirectAuto(url);
	}
} satisfies Actions;
