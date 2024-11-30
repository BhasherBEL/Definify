<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import theme from '$lib/components/theme.svelte';

	let { data }: { data: PageData } = $props();
	let user = data.user;
</script>

<div class="m-4 flex flex-grow flex-col md:mx-auto md:w-[42rem]">
	<div class="flex-grow">
		{#if user}
			<label for="email" class="mb-2 block text-sm font-medium opacity-90">
				{$t('common.words.email')}
			</label>
			<input type="text" name="email" id="email" value={user.email} class="input-text" disabled />
		{/if}
		<span class="mb-2 mt-4 block text-sm font-medium opacity-90 dark:text-inherit">
			{$t('common.words.theme')}
			<span class="float-right text-xs italic opacity-70"
				>{$t('account.theme.device-specific')}</span
			>
		</span>
		<div
			class="grid grid-cols-3 divide-x divide-gray-400 overflow-hidden rounded-lg border border-gray-400 dark:divide-gray-600 dark:border-gray-600"
		>
			<form
				action="?/theme-light"
				method="POST"
				class="hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600"
				use:enhance={() => {
					theme.dark = false;
				}}
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
				use:enhance={() => {
					theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				}}
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
				use:enhance={() => {
					theme.dark = true;
				}}
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
				class="center bg-action-zone dark:bg-action-zone-dark text-action-zone-text dark:text-action-zone-text-dark w-full rounded-lg p-4 text-center hover:bg-primary-800"
			>
				{$t('header.logout')}
			</button>
		</form>
	{:else}
		<a
			href="/login?redirect=/account"
			class="center my-2 w-full rounded-lg border border-primary-600 p-4 text-center hover:bg-primary-200"
			>{$t('header.login')}</a
		>
		<a
			href="/register?redirect=/account"
			class="center w-full rounded-lg bg-primary-600 p-4 text-center text-white hover:bg-primary-800 dark:bg-primary-700 dark:text-inherit dark:hover:bg-primary-600"
		>
			{$t('header.register')}
		</a>
	{/if}
</div>
