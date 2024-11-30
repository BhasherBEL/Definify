<script lang="ts">
	import { t } from '$lib/translations';
	import { startAuthentication } from '@simplewebauthn/browser';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();

	let error = $state();

	async function loginPasskey() {
		const optionsResp = await fetch('/api/login/passkeys', {
			redirect: 'follow'
		});

		if (optionsResp.redirected) {
			window.location.href = optionsResp.url;
		}

		const { options: optionsJSON, rid } = await optionsResp.json();

		let asseResp;
		try {
			asseResp = await startAuthentication({ optionsJSON });
		} catch (e) {
			error = e;
			return;
		}

		const verificationResp = await fetch('/api/login/passkeys', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ rid, response: asseResp }),
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

<section>
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
		<div
			class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1 class="text-center text-xl font-bold leading-tight tracking-tight md:text-2xl">
					{$t('login.title')}
				</h1>
				{#if error || form?.invalid || form?.incorrect}
					<div
						class="rounded border border-red-600 bg-red-50 p-2 text-center text-red-900 dark:bg-red-900 dark:text-red-200"
					>
						{#if error}
							{error}
						{:else if form?.invalid}
							{$t('login.error.invalid')}
						{:else if form?.incorrect}
							{$t('login.error.incorrect')}
						{/if}
					</div>
				{/if}
				<div class="flex flex-col">
					<button
						class="h-10 rounded border border-slate-300 p-2 text-sm opacity-80"
						onclick={loginPasskey}
					>
						{$t('login.passkey')}
					</button>
				</div>
				<div class="relative flex items-center">
					<div class="flex-grow border-t border-gray-400"></div>
					<span class="mx-4 flex-shrink text-gray-400">{$t('common.word.or')}</span>
					<div class="flex-grow border-t border-gray-400"></div>
				</div>
				<form class="space-y-4 md:space-y-6" method="POST">
					<div>
						<label for="email" class="mb-2 block text-sm font-medium opacity-90">
							{$t('login.email')}
						</label>
						<input type="text" name="email" id="email" class="input-text" required={true} />
					</div>
					<div>
						<label for="password" class="mb-2 block text-sm font-medium opacity-90">
							{$t('login.password')}
						</label>
						<input
							type="password"
							name="password"
							id="password"
							class="input-text"
							required={true}
						/>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-start">
							<div class="flex h-5 items-center">
								<input
									id="remember"
									aria-describedby="remember"
									type="checkbox"
									class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
									checked={true}
									required={true}
								/>
							</div>
							<div class="ml-3 text-sm">
								<label for="remember">
									{$t('login.remember')}
								</label>
							</div>
						</div>
						<a
							href="#forgot"
							class="text-action-text dark:text-action-text-dark text-sm font-medium hover:underline"
						>
							{$t('login.forgotPassword')}
						</a>
					</div>
					<input
						type="submit"
						class="bg-action-zone text-action-zone-text dark:bg-action-zone-dark dark:text-action-zone-text-dark w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
						value={$t('login.button')}
					/>
				</form>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					{$t('login.register.pre')}
					<a
						href="/register"
						class="text-action-text dark:text-action-text-dark font-medium hover:underline"
					>
						{$t('login.register.link')}
					</a>
				</p>
			</div>
		</div>
	</div>
</section>
