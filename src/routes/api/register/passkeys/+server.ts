import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../../../$types';
import { generateUserId, validateEmail, validateUsername } from '$lib/server/auth';
import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	type VerifiedRegistrationResponse
} from '@simplewebauthn/server';
import { rp } from '$lib/server/passkeys';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
import * as tables from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { checkEmail, checkUsername } from '$lib/server/db/users';
import { safeRedirect } from '$lib/utils/security';

const inProgress = new Map<string, PublicKeyCredentialCreationOptionsJSON>();

export async function POST({ locals, request, cookies, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const { username, email, reply } = await request.json();

	if (!reply) {
		if (!validateUsername(username)) {
			return error(400, 'Invalid username');
		}

		if (!checkUsername(username)) {
			return error(400, 'Username already exists');
		}

		if (!validateEmail(email)) {
			return error(400, 'Invalid email');
		}

		if (!checkEmail(email)) {
			return error(400, 'Email already exists');
		}

		const options = await generateRegistrationOptions({
			rpName: rp.name,
			rpID: rp.id,
			userName: email,
			attestationType: 'none',
			authenticatorSelection: {
				residentKey: 'preferred',
				userVerification: 'preferred',
				authenticatorAttachment: 'cross-platform'
			}
		});

		inProgress.set(email, options);

		return json(options);
	}

	if (!reply || !email || !username) {
		return error(400, 'Bad request');
	}

	const options = inProgress.get(email);
	if (!options) {
		return error(400, 'Missing registration options');
	}

	let verification: VerifiedRegistrationResponse;

	try {
		verification = await verifyRegistrationResponse({
			response: reply,
			expectedChallenge: options.challenge,
			expectedOrigin: rp.origin,
			expectedRPID: rp.id
		});
	} catch (e) {
		return error(400, 'Invalid registration response');
	}

	const { verified, registrationInfo } = verification;

	if (!verified || !registrationInfo) return false;

	const { credential } = registrationInfo;

	const userId = generateUserId();

	try {
		const usersDb: tables.User[] = await db
			.insert(tables.users)
			.values({ username, email, id: userId })
			.onConflictDoNothing()
			.returning();

		if (!usersDb.length) {
			return fail(400, { username: 'Failed to create user' });
		}

		const user = usersDb[0];

		await db
			.insert(tables.passkeys)
			.values({
				id: credential.id,
				userId: user.id,
				webauthnUserId: options.user.id,
				publicKey: credential.publicKey,
				counter: credential.counter,
				transports: credential.transports?.join(',') || ''
			})
			.onConflictDoNothing();

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
	} catch (e) {
		console.error(e);
		return fail(500, { error: true });
	}

	const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
	return redirect(302, redirectUrl);
}
