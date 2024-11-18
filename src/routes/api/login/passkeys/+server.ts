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

const inProgress = new Map<
	string,
	{ options: PublicKeyCredentialRequestOptionsJSON; date: Date }
>();

export async function GET({ locals }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
		rpID: rp.id,
		allowCredentials: []
	});

	const rid = generateUserId();

	inProgress.set(rid, { options, date: new Date() });

	return json({ rid, options });
}

export async function POST({ locals, cookies, request, url }: RequestEvent) {
	if (locals.user) {
		return error(403, 'You are already logged in');
	}

	const { rid, reply } = await request.json();

	const optionsStored = inProgress.get(rid);
	if (!optionsStored) {
		return error(400, 'Missing registration options');
	}
	inProgress.delete(rid);
	const { options, date } = optionsStored;
	if (Date.now() - date.getTime() > 5 * 60 * 1000) {
		return error(400, 'Timeout. Please try again');
	}

	const passkeyId = reply.id;
	if (!passkeyId) {
		return error(400, 'Failed to parse passkey id');
	}

	const passkey = await db.query.passkeys.findFirst({
		where: eq(tables.passkeys.id, passkeyId),
		with: { user: true }
	});
	if (!passkey) {
		return error(404, 'Unknown passkey');
	}

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
			},
			requireUserVerification: false
		});
	} catch (e) {
		console.warn(e);
		return error(400, 'Failed to verify passkey');
	}

	const { verified } = verification;
	if (!verified) {
		return error(400, 'Passkey refused');
	}

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, passkey.user.id);
	auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

	const redirectUrl = safeRedirect(url.searchParams.get('redirect'), url.origin);
	return redirect(302, redirectUrl);
}
