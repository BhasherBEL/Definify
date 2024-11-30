import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	'theme-light': async ({ cookies }) => {
		cookies.set('theme', 'light', {
			httpOnly: true,
			sameSite: 'lax',
			path: '/'
		});

		//return redirect(303, '/account');
	},
	'theme-auto': async ({ cookies }) => {
		cookies.delete('theme', {
			httpOnly: true,
			sameSite: 'lax',
			path: '/'
		});

		//return redirect(303, '/account');
	},
	'theme-dark': async ({ cookies }) => {
		cookies.set('theme', 'dark', {
			httpOnly: true,
			sameSite: 'lax',
			path: '/'
		});

		//return redirect(303, '/account');
	}
} satisfies Actions;
