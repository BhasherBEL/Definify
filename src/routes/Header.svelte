<script lang="ts">
	import { t } from '$lib/translations';
	import Gravatar from 'svelte-gravatar';

	let { data } = $props();
	let user = data?.user || null;
</script>

<header>
	<nav class="mx-auto px-4 py-2 md:max-w-5xl md:px-2 md:py-2.5">
		<div class="mx-auto flex flex-wrap items-center justify-between">
			<a
				href="/"
				class="flex items-center self-center whitespace-nowrap font-['OleoScript'] text-2xl font-semibold"
			>
				{$t('common.name')}
			</a>
			<div class="order-2 hidden items-center md:flex">
				{#if user}
					<div>
						<a href="/account" aria-label="user">
							<Gravatar
								email={user.email}
								default="identicon"
								class="size-8 rounded-lg border border-black"
							/>
						</a>
					</div>
				{:else}
					<a
						href="/login"
						class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 md:px-5 md:py-2.5 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
						>{$t('header.login')}</a
					>
					<a
						href="/register"
						class="mr-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 md:px-5 md:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						{$t('header.register')}
					</a>
				{/if}
			</div>
			<div
				class="hidden w-full items-center justify-between md:visible md:order-1 md:flex md:w-auto"
			>
				<ul class="mt-4 flex flex-col font-medium md:mt-0 md:flex-row md:space-x-8">
					<li>
						<a
							href="/"
							class="block rounded bg-primary-700 py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-primary-700 dark:text-white"
							aria-current="page"
						>
							{$t('header.menu.home')}
						</a>
					</li>
					<li>
						<a
							href="/words"
							class="block rounded bg-primary-700 py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-primary-700 dark:text-white"
							aria-current="page"
						>
							{$t('header.menu.words')}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
