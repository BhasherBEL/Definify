<script lang="ts">
	import { t } from '$lib/translations';

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

<header
	class="lg:border-b lg:border-gray-200 lg:bg-gray-50 lg:shadow-[0_0_6px_0_rgba(0,14,156,.2)]"
>
	<nav class="px-4 py-2 lg:border-gray-200 lg:bg-white lg:px-6 lg:py-2.5 lg:dark:bg-gray-800">
		<div class="mx-auto flex flex-wrap items-center justify-between">
			<a
				href="/"
				class="flex items-center self-center whitespace-nowrap font-['OleoScript'] text-2xl font-semibold dark:text-white"
			>
				{$t('common.name')}
			</a>
			<div class="flex items-center lg:order-2"></div>
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
