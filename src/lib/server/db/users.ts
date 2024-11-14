import { eq } from 'drizzle-orm';
import { db } from '.';
import * as table from './schema';

export const getUserByUsername = async (username: string) => {
	const results = await db.select().from(table.users).where(eq(table.users.username, username));

	return results.at(0);
};

export const createUser = async (
	id: string,
	username: string,
	email: string,
	passwordHash: string
) => {
	await db.insert(table.users).values({ id, username, email, passwordHash });
};
