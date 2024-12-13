import { defaultLogoutAction } from '@bhasher/svelte-auth';
import type { Actions } from './$types';
import auth from '$lib/server/auth';

export const actions: Actions = {
	default: defaultLogoutAction(auth)
};
