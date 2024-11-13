<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';

	let { form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
		<div
			class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1
					class="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
				>
					{$t('register.title')}
				</h1>
				{#if form?.invalid || form?.error}
					<div
						class="border-2-lg rounded border border-red-600 bg-red-200 p-2 text-center text-red-900"
					>
						{#if form?.invalid}
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
				<form class="space-y-4 md:space-y-6" action="" method="POST">
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
							class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required={true}
						/>
					</div>
					<div>
						<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
							{$t('register.email')}
						</label>
						<input
							type="email"
							name="email"
							id="email"
							class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required={true}
						/>
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
							class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required={true}
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
							class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required={true}
						/>
					</div>
					<button
						type="submit"
						class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
					>
						{$t('register.button')}
					</button>
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						{$t('register.login.pre')}
						<a
							href="/login"
							class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
						>
							{$t('register.login.link')}
						</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
