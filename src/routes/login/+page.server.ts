import type { PageServerLoad } from './$types';
import { type Actions } from '@sveltejs/kit';
import { defaultLoginAction, safeRedirectAuto } from '@bhasher/svelte-auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		console.log('Nop');
		let a = safeRedirectAuto(url);
		console.log('a', a);
		return a;
	}

	return {};
};

export const actions: Actions = {
	default: defaultLoginAction()
} satisfies Actions;
