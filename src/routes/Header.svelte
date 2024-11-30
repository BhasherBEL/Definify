<script lang="ts">
	import theme from '$lib/components/theme.svelte';
	import { t } from '$lib/translations';
	import Gravatar from 'svelte-gravatar';
	import { enhance } from '$app/forms';

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
				<form
					class="pl-4"
					class:hidden={theme.dark}
					action="/account?/theme-dark"
					method="POST"
					use:enhance={() => {
						theme.dark = true;
					}}
				>
					<button aria-label="Theme switch">
						<svg class="size-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
							>
							</path>
						</svg>
					</button>
				</form>
				<form
					class="pl-4"
					class:hidden={!theme.dark}
					action="/account?/theme-light"
					method="POST"
					use:enhance={() => {
						theme.dark = false;
					}}
				>
					<button aria-label="Theme switch">
						<svg class="size-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
							>
							</path>
						</svg>
					</button>
				</form>
			</div>
			<div class="order-1 hidden w-auto items-center justify-between md:flex">
				<ul class="mt-0 flex flex-row space-x-8 font-medium">
					<li>
						<a href="/" aria-current="page">
							{$t('header.menu.home')}
						</a>
					</li>
					<li>
						<a href="/words" aria-current="page">
							{$t('header.menu.words')}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
