<script lang="ts">
	import { t } from '$lib/translations';
	import { startAuthentication } from '@simplewebauthn/browser';

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

	let email = $state();
	let password = $state();

	async function loginButton() {
		if (!email || !password) return;

		const resp = await fetch('/api/login/passwords', {
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
			error = (await resp.json()).message;
		}
	}
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
		<div
			class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1
					class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
				>
					{$t('login.title')}
				</h1>
				{#if error}
					<div
						class="border-2-lg rounded border border-red-600 bg-red-200 p-2 text-center text-red-900"
					>
						{error}
					</div>
				{/if}
				<div class="flex flex-col">
					<button
						class="h-10 rounded border border-slate-300 p-2 text-sm text-gray-600"
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
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
						{$t('login.email')}
					</label>
					<input
						type="text"
						name="email"
						id="email"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						required={true}
						bind:value={email}
					/>
				</div>
				<div>
					<label
						for="password"
						class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>
						{$t('login.password')}
					</label>
					<input
						type="password"
						name="password"
						id="password"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						required={true}
						bind:value={password}
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
							<label for="remember" class="text-gray-500 dark:text-gray-300">
								{$t('login.remember')}
							</label>
						</div>
					</div>
					<a
						href="#forgot"
						class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
					>
						{$t('login.forgotPassword')}
					</a>
				</div>
				<button
					onclick={loginButton}
					class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>
					{$t('login.button')}
				</button>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					{$t('login.register.pre')}
					<a
						href="/register"
						class="font-medium text-primary-600 hover:underline dark:text-primary-500"
					>
						{$t('login.register.link')}
					</a>
				</p>
			</div>
		</div>
	</div>
</section>
