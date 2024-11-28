<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let user = data.user;
</script>

<div class="m-4 flex flex-grow flex-col">
	<div class="flex-grow">
		{#if user}
			<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
				{$t('common.words.email')}
			</label>
			<input
				type="text"
				name="email"
				id="email"
				value={user.email}
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
				disabled
			/>
		{/if}
		<span class="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">
			{$t('common.words.theme')}
		</span>
		<div
			class="grid grid-cols-3 divide-x divide-gray-400 overflow-hidden rounded-lg border border-gray-400 dark:divide-gray-600 dark:border-gray-600 dark:text-white"
		>
			<form
				action="?/theme-light"
				method="POST"
				class="hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			>
				<input
					class="w-full p-4 hover:cursor-pointer"
					value={$t('account.theme.light')}
					type="submit"
				/>
			</form>
			<form
				action="?/theme-auto"
				method="POST"
				class="hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			>
				<input
					class="w-full p-4 hover:cursor-pointer"
					value={$t('account.theme.auto')}
					type="submit"
				/>
			</form>
			<form
				action="?/theme-dark"
				method="POST"
				class="hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			>
				<input
					class="w-full p-4 hover:cursor-pointer"
					value={$t('account.theme.dark')}
					type="submit"
				/>
			</form>
		</div>
	</div>
	{#if user}
		<form method="POST" action="/logout">
			<button
				class="center w-full rounded-lg bg-primary-600 p-4 text-center text-white hover:bg-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 dark:hover:text-white"
			>
				{$t('header.logout')}
			</button>
		</form>
	{:else}
		<a
			href="/login?redirect=/account"
			class="center my-2 w-full rounded-lg border border-primary-600 p-4 text-center text-primary-600 hover:bg-primary-200 hover:text-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 dark:hover:text-white"
			>{$t('header.login')}</a
		>
		<a
			href="/register?redirect=/account"
			class="center w-full rounded-lg bg-primary-600 p-4 text-center text-white hover:bg-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 dark:hover:text-white"
		>
			{$t('header.register')}
		</a>
	{/if}
</div>
