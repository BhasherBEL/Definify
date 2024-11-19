import { Auth } from '@bhasher/svelte-auth';
import { db } from '$lib/server/db';
import * as types from '$lib/server/db/schema';

export default new Auth(db, types, 'session', {
	name: 'definify',
	id: 'localhost',
	origin: 'http://localhost:5173'
});
