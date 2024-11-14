import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',

	dbCredentials: {
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_TOKEN
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite',
	driver: process.env.DATABASE_TOKEN ? 'turso' : undefined
});
