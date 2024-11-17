import { generateUserId } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { rp } from '$lib/server/passkeys';
import {
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
	type VerifiedAuthenticationResponse
} from '@simplewebauthn/server';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { error, json, redirect, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as tables from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { safeRedirect } from '$lib/utils/security';

const inProgress = new Map<string, PublicKeyCredentialRequestOptionsJSON>();

export async function GET({ locals }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const passkeys = await db.query.passkeys.findMany();

	const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
		rpID: rp.id,
		allowCredentials: passkeys.map((passkey) => ({
			id: passkey.id
		}))
	});

	const rid = generateUserId();

	inProgress.set(rid, options);

	return json({ rid, options });
}

export async function POST({ locals, cookies, request, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const { rid, reply } = await request.json();

	const options = inProgress.get(rid);
	if (!options) {
		return error(400, 'Invalid request 1');
	}

	const passkeyId = reply.id;
	if (!passkeyId) {
		return error(400, 'Invalid request 2');
	}

	const passkey = await db.query.passkeys.findFirst({
		where: eq(tables.passkeys.id, passkeyId),
		with: { user: true }
	});
	if (!passkey) {
		return error(400, 'Invalid request 3');
	}

	console.log(typeof passkey.publicKey, passkey.publicKey);

	let verification: VerifiedAuthenticationResponse;
	try {
		verification = await verifyAuthenticationResponse({
			response: reply,
			expectedChallenge: options.challenge,
			expectedOrigin: rp.origin,
			expectedRPID: rp.id,
			credential: {
				id: passkey.id,
				publicKey: passkey.publicKey,
				counter: passkey.counter
			}
		});
	} catch (e) {
		console.warn(e);
		return error(400, 'Invalid request 4');
	}

	const { verified } = verification;
	if (!verified) {
		return error(400, 'Invalid request 5');
	}

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, passkey.user.id);
	auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

	const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
	return redirect(302, redirectUrl);
}
