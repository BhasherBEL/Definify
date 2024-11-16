import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const words = (
		await db.query.usersWords.findMany({
			where: eq(tables.usersWords.userId, locals.user.id),
			with: {
				word: true
			}
		})
	)
		.map((uw) => uw.word)
		.map(({ word, definition }) => ({ word, definition: JSON.parse(definition) }));

	return {
		words
	};
};
