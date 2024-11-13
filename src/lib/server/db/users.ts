import { eq } from 'drizzle-orm';
import { db } from '.';
import * as table from './schema';

export const getUserByUsername = async (username: string) => {
	const results = await db.select().from(table.user).where(eq(table.user.username, username));

	return results.at(0);
};

export const createUser = async (
	id: string,
	username: string,
	email: string,
	passwordHash: string
) => {
	await db.insert(table.user).values({ id, username, email, passwordHash });
};
