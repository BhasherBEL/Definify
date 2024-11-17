<script lang="ts">
	import { t } from '$lib/translations';
	import { get } from 'svelte/store';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';
	import { startRegistration } from '@simplewebauthn/browser';
	import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

	let { form }: { data: PageData; form: ActionData } = $props();

	let step = $state(0);

	let error: string | undefined = $state();

	let username: string | undefined = $state();
	let email: string | undefined = $state();
	let password: string | undefined = $state();
	let confirmPassword: string | undefined = $state();

	async function buttonClick() {
		if (step === 0) {
			if (!username || !email) return;

			step++;
			return;
		}
	}

	async function registerPasskey() {
		if (!username || !email) return;

		const optionsResp = await fetch('/api/register/passkeys', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, email })
		});

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
			body: JSON.stringify({ reply: attResp, email, username }),
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
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
		<div
			class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
		>
			<div class="p-6 sm:p-8">
				<h1
					class="mb-8 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
				>
					{$t('register.title')}
				</h1>

				{#if form?.invalid || form?.error || error}
					<div
						class="border-2-lg mb-4 rounded border border-red-600 bg-red-200 p-2 text-center text-red-900"
					>
						{#if error}
							{error}
						{:else if form?.invalid}
							{#if form?.username}
								{$t('register.error.invalid.username')}
							{:else if form?.password}
								{$t('login.error.invalid.password')}
							{:else if form?.email}
								{$t('register.error.invalid.email')}
							{:else if form?.confirmPassword}
								{$t('register.error.invalid.confirmPassword')}
							{/if}
						{:else}
							{$t('common.error.unknown')}
						{/if}
					</div>
				{/if}
				<div class="space-y-4 md:space-y-6">
					{#if step === 0}
						<div>
							<label
								for="username"
								class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>
								{$t('register.username')}
							</label>
							<input
								type="text"
								name="username"
								id="username"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								bind:value={username}
							/>
						</div>
						<div>
							<label
								for="email"
								class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>
								{$t('register.email')}
							</label>
							<input
								type="email"
								name="email"
								id="email"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								bind:value={email}
							/>
						</div>
					{:else if step == 1}
						<div class="flex flex-col">
							<button
								class="h-10 rounded border border-slate-300 p-2 text-sm text-gray-600"
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
							<label
								for="password"
								class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>
								{$t('register.password')}
							</label>
							<input
								type="password"
								name="password"
								id="password"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								bind:value={password}
							/>
						</div>
						<div>
							<label
								for="confirm-password"
								class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>
								{$t('register.confirmPassword')}
							</label>
							<input
								type="password"
								name="confirm-password"
								id="confirm-password"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								bind:value={confirmPassword}
							/>
						</div>
					{/if}
					<button
						class="w-full rounded-lg border border-transparent bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:border-primary-400 disabled:bg-primary-100 disabled:text-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
						onclick={buttonClick}
						disabled={(step === 0 && (!username || !email)) ||
							(step === 1 && (!password || !confirmPassword))}
					>
						{#if step === 1}
							{$t('register.button.register')}
						{:else}
							{$t('register.button.next')}
						{/if}
					</button>
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						{$t('register.login.pre')}
						<a
							href="/login"
							class="font-medium text-primary-600 hover:underline dark:text-primary-500"
						>
							{$t('register.login.link')}
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
