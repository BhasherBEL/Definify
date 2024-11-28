<script lang="ts">
	import { t } from '$lib/translations';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	let currentPage = derived(page, ($page) => {
		const path = $page.url.pathname;
		if (path.startsWith('/words') || $page.url.searchParams.get('redirect') === '/words') {
			return 'words';
		}
		if (path.startsWith('/account') || $page.url.searchParams.get('redirect') === '/account') {
			return 'account';
		}
		if (path == '/') return 'home';
	});
</script>

<div
	class="relative z-10 grid grid-cols-3 justify-around border-t bg-white p-1 dark:border-neutral-950 dark:bg-gray-700 dark:fill-white dark:text-white md:hidden"
>
	<a
		href="/words"
		class="flex flex-col items-center justify-center text-center"
		class:text-primary-800={$currentPage === 'words'}
		class:fill-primary-800={$currentPage === 'words'}
		class:dark:text-primary-300={$currentPage === 'words'}
		class:dark:fill-primary-300={$currentPage === 'words'}
	>
		<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.5833 33.3333H18.75V8.33333H14.5833V33.3333ZM12.5 45.8333C10.7639 45.8333 9.28819 45.2257 8.07292 44.0104C6.85764 42.7951 6.25 41.3194 6.25 39.5833V10.4167C6.25 8.68055 6.85764 7.20486 8.07292 5.98958C9.28819 4.7743 10.7639 4.16666 12.5 4.16666H35.4167V37.5H12.5C11.9097 37.5 11.4153 37.7 11.0167 38.1C10.6181 38.5 10.4181 38.9944 10.4167 39.5833C10.4153 40.1722 10.6153 40.6674 11.0167 41.0687C11.4181 41.4701 11.9125 41.6694 12.5 41.6667H39.5833V8.33333H43.75V45.8333H12.5Z"
			/>
		</svg>
		{$t('footer.menu.words')}
	</a>
	<a
		href="/"
		class="flex flex-col items-center justify-center text-center"
		class:text-primary-800={$currentPage === 'home'}
		class:fill-primary-800={$currentPage === 'home'}
		class:dark:text-primary-300={$currentPage === 'home'}
		class:dark:fill-primary-300={$currentPage === 'home'}
	>
		<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M40.8333 43.75L27.7083 30.625C26.6667 31.4583 25.4688 32.1181 24.1146 32.6042C22.7604 33.0903 21.3194 33.3333 19.7917 33.3333C16.0069 33.3333 12.8042 32.0222 10.1833 29.4C7.5625 26.7778 6.25139 23.575 6.25 19.7917C6.24861 16.0083 7.55972 12.8056 10.1833 10.1833C12.8069 7.56111 16.0097 6.25 19.7917 6.25C23.5736 6.25 26.7771 7.56111 29.4021 10.1833C32.0271 12.8056 33.3375 16.0083 33.3333 19.7917C33.3333 21.3194 33.0903 22.7604 32.6042 24.1146C32.1181 25.4687 31.4583 26.6667 30.625 27.7083L43.75 40.8333L40.8333 43.75ZM19.7917 29.1667C22.3958 29.1667 24.6097 28.2556 26.4333 26.4333C28.2569 24.6111 29.1681 22.3972 29.1667 19.7917C29.1653 17.1861 28.2542 14.9729 26.4333 13.1521C24.6125 11.3313 22.3986 10.4194 19.7917 10.4167C17.1847 10.4139 14.9715 11.3257 13.1521 13.1521C11.3326 14.9785 10.4208 17.1917 10.4167 19.7917C10.4125 22.3917 11.3243 24.6056 13.1521 26.4333C14.9799 28.2611 17.1931 29.1722 19.7917 29.1667Z"
			/>
		</svg>
		{$t('footer.menu.search')}
	</a>
	<a
		href="/account"
		class="flex flex-col items-center justify-center text-center"
		class:text-primary-800={$currentPage === 'account'}
		class:fill-primary-800={$currentPage === 'account'}
		class:dark:text-primary-300={$currentPage === 'account'}
		class:dark:fill-primary-300={$currentPage === 'account'}
	>
		<svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
			/>
		</svg>
		{$t('footer.menu.account')}
	</a>
</div>
