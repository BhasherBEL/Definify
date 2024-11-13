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

<header class="border-b border-gray-200 bg-gray-50">
	<nav class="border-gray-200 bg-white px-4 py-2.5 lg:px-6 dark:bg-gray-800">
		<div class="mx-auto flex flex-wrap items-center justify-between">
			<a
				href="/"
				class="flex items-center self-center whitespace-nowrap text-xl font-semibold dark:text-white"
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
								class="size-8 rounded-full border border-black"
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
											<a
												href="#"
												class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
												>Settings</a
											>
										</li>
									</ul>
									<div class="py-1">
										<form method="POST" action="/logout">
											<button
												class="text-primary-800 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
						class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 lg:px-5 lg:py-2.5 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
						>{$t('header.login')}</a
					>
					<a
						href="/register"
						class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-2 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
					>
						{$t('header.register')}
					</a>
				{/if}
				<button
					data-collapse-toggle="mobile-menu-2"
					type="button"
					class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					aria-controls="mobile-menu-2"
					aria-expanded="false"
				>
					<span class="sr-only">{$t('header.openMenu')}</span>
					<svg
						class="h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path></svg
					>
					<svg
						class="hidden h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path></svg
					>
				</button>
			</div>
			<div
				class="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
				id="mobile-menu-2"
			>
				<ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
					<li>
						<a
							href="/"
							class="bg-primary-700 lg:text-primary-700 block rounded py-2 pl-3 pr-4 text-white lg:bg-transparent lg:p-0 dark:text-white"
							aria-current="page"
						>
							{$t('header.menu.home')}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
