<script lang="ts">
	import { t } from '$lib/translations';
	import Gravatar from 'svelte-gravatar';

	let { data } = $props();

	let isUserDropdownOpen = $state(false);
	let user = data?.user || null;

	const handleUserDropdownClick = () => {
		isUserDropdownOpen = !isUserDropdownOpen;
	};

	const handleUserDropdownFocusLoss = ({
		relatedTarget,
		currentTarget
	}: {
		relatedTarget: EventTarget | null;
		currentTarget: EventTarget & HTMLDivElement;
	}) => {
		if (
			currentTarget instanceof HTMLElement &&
			relatedTarget instanceof Node &&
			currentTarget.contains(relatedTarget)
		)
			return;
		isUserDropdownOpen = false;
	};
</script>

<header class="border-b border-gray-200 bg-gray-50 shadow-[0_0_6px_0_rgba(0,14,156,.2)]">
	<nav class="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
		<div class="mx-auto flex flex-wrap items-center justify-between">
			<a
				href="/"
				class="flex items-center self-center whitespace-nowrap font-['OleoScript'] text-2xl font-semibold dark:text-white"
			>
				{$t('common.name')}
			</a>
			<div class="flex items-center lg:order-2">
				{#if user}
					<div onfocusout={handleUserDropdownFocusLoss}>
						<button onclick={handleUserDropdownClick} aria-label="user">
							<Gravatar
								email={user.email}
								default="identicon"
								class="size-8 rounded-xl border border-black"
							/>
						</button>
						{#if isUserDropdownOpen}
							<div class="relative">
								<div
									id="dropdownNavbar"
									class="absolute left-full z-10 float-end w-44 -translate-x-full divide-y divide-gray-100 rounded-lg bg-white font-normal shadow dark:divide-gray-600 dark:bg-gray-700"
								>
									<ul
										class="py-2 text-sm text-gray-700 dark:text-gray-400"
										aria-labelledby="dropdownLargeButton"
									>
										<li>
											<span
												class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
											>
												Settings
											</span>
										</li>
									</ul>
									<div class="py-1">
										<form method="POST" action="/logout">
											<button
												class="block w-full px-4 py-2 text-left text-sm text-primary-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
											>
												{$t('header.logout')}
											</button>
										</form>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/login"
						class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 lg:px-5 lg:py-2.5"
						>{$t('header.login')}</a
					>
					<a
						href="/register"
						class="mr-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:px-5 lg:py-2.5"
					>
						{$t('header.register')}
					</a>
				{/if}
			</div>
			<div
				class="hidden w-full items-center justify-between lg:visible lg:order-1 lg:flex lg:w-auto"
			>
				<ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
					<li>
						<a
							href="/"
							class="block rounded bg-primary-700 py-2 pl-3 pr-4 text-white dark:text-white lg:bg-transparent lg:p-0 lg:text-primary-700"
							aria-current="page"
						>
							{$t('header.menu.home')}
						</a>
					</li>
					<li>
						<a
							href="/words"
							class="block rounded bg-primary-700 py-2 pl-3 pr-4 text-white dark:text-white lg:bg-transparent lg:p-0 lg:text-primary-700"
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
