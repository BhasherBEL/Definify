<script lang="ts">
	import { t } from '$lib/translations';
	import { get } from 'svelte/store';
	import { startRegistration } from '@simplewebauthn/browser';
	import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

	let step = $state(0);

	let error: string | undefined = $state();

	let email: string | undefined = $state();
	let password: string | undefined = $state();
	let confirmPassword: string | undefined = $state();

	async function buttonClick() {
		if (step === 0) {
			if (!email) return;

			step++;
			return;
		} else if (step === 1) {
			if (!email || !password || !confirmPassword) return;
			if (password !== confirmPassword) {
				error = get(t)('register.error.password.match');
				return;
			}

			const resp = await fetch('/api/register/passwords', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password }),
				redirect: 'follow'
			});

			if (resp.redirected) {
				window.location.href = resp.url;
			}

			if (!resp.ok) {
				error = await resp.text();
				return;
			}
		}
	}

	async function registerPasskey() {
		if (!email) return;

		const optionsResp = await fetch('/api/register/passkeys?' + new URLSearchParams({ email }), {
			redirect: 'follow'
		});

		if (optionsResp.redirected) {
			window.location.href = optionsResp.url;
		}

		if (!optionsResp.ok) {
			error = await optionsResp.text();
			return;
		}

		const optionsJSON: PublicKeyCredentialCreationOptionsJSON = await optionsResp.json();

		let attResp;
		try {
			attResp = await startRegistration({ optionsJSON });
		} catch (e: any) {
			if (e.name === 'InvalidStateError') {
				error = get(t)('register.error.passkey.already');
			} else if (e.name === 'NotAllowedError') {
				error = get(t)('register.error.passkey.denied');
			} else {
				error = get(t)('register.error.passkey.failed');
			}
			console.warn(e);
			return;
		}

		const verificationResp = await fetch('/api/register/passkeys', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ response: attResp, email }),
			redirect: 'follow'
		});

		if (verificationResp.redirected) {
			window.location.href = verificationResp.url;
		}

		const verificationJSON = await verificationResp.json();

		if (!verificationResp.ok) {
			error = verificationJSON.message;
			return;
		}
	}

	function verifyEmail(email?: string) {
		if (!email) return;
		return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
	}
</script>

<section>
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
		<div
			class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="p-6 sm:p-8">
				<h1 class="mb-8 text-center text-xl font-bold leading-tight tracking-tight md:text-2xl">
					{$t('register.title')}
				</h1>

				{#if error}
					<div
						class="border-2-lg mb-4 rounded border border-red-600 bg-red-200 p-2 text-center text-red-900"
					>
						{error}
					</div>
				{/if}
				<div class="space-y-4 md:space-y-6">
					{#if step === 0}
						<div>
							<label for="email" class="mb-2 block text-sm font-medium opacity-90">
								{$t('register.email')}
							</label>
							<input type="email" name="email" id="email" class="input-text" bind:value={email} />
						</div>
					{:else if step == 1}
						<div class="flex flex-col">
							<button
								class="h-10 rounded border border-slate-300 p-2 text-sm opacity-80"
								onclick={registerPasskey}
							>
								{$t('register.passkey')}
							</button>
						</div>
						<div class="relative flex items-center">
							<div class="flex-grow border-t border-gray-400"></div>
							<span class="mx-4 flex-shrink text-gray-400">{$t('common.word.or')}</span>
							<div class="flex-grow border-t border-gray-400"></div>
						</div>
						<div>
							<label for="password" class="mb-2 block text-sm font-medium opacity-90">
								{$t('register.password')}
							</label>
							<input
								type="password"
								name="password"
								id="password"
								class="input-text"
								bind:value={password}
							/>
						</div>
						<div>
							<label for="confirm-password" class="mb-2 block text-sm font-medium opacity-90">
								{$t('register.confirmPassword')}
							</label>
							<input
								type="password"
								name="confirm-password"
								id="confirm-password"
								class="input-text"
								bind:value={confirmPassword}
							/>
						</div>
					{/if}
					<button
						class="bg-action-zone dark:bg-action-zone-dark w-full rounded-lg border border-transparent px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-primary-300 hover:enabled:bg-primary-700 disabled:opacity-30 dark:focus:ring-primary-800 dark:enabled:hover:bg-primary-700"
						onclick={buttonClick}
						disabled={(step === 0 && !verifyEmail(email)) ||
							(step === 1 && (!password || !confirmPassword))}
					>
						{#if step === 1}
							{$t('register.button.register')}
						{:else}
							{$t('register.button.next')}
						{/if}
					</button>
					<p class="text-sm font-light">
						{$t('register.login.pre')}
						<a
							href="/login"
							class="text-action-text dark:text-action-text-dark font-medium hover:underline"
						>
							{$t('register.login.link')}
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
