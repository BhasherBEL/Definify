import { Auth } from '@bhasher/svelte-auth';
import { db } from '$lib/server/db';
import * as types from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export default new Auth(db, types, 'session', {
	name: 'definify',
	id: env.DOMAIN,
	origin: [env.URL]
});
