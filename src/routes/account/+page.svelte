<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let user = data.user;
</script>

{#if user}
	<div class="m-4 flex flex-grow flex-col">
		<div class="flex-grow">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
					{$t('common.words.email')}
				</label>
				<input
					type="text"
					name="email"
					id="email"
					value={user.email}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					disabled
				/>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button
				class="center w-full rounded-lg bg-primary-600 p-4 text-center text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
			>
				{$t('header.logout')}
			</button>
		</form>
	</div>
{:else}
	<a
		href="/login?redirect=/account"
		class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 lg:px-5 lg:py-2.5"
		>{$t('header.login')}</a
	>
	<a
		href="/register?redirect=/account"
		class="mr-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:px-5 lg:py-2.5"
	>
		{$t('header.register')}
	</a>
{/if}
