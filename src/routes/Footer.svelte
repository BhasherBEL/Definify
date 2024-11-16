<script lang="ts">
	import { t } from '$lib/translations';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	let currentPage = derived(page, ($page) => {
		const path = $page.url.pathname;
		if (path.startsWith('/words')) return 'words';
		if (path.startsWith('/study')) return 'study';
		return 'home';
	});
</script>

<div class="relative z-10 flex justify-around bg-primary-700 p-4 text-white lg:hidden">
	<a
		href="/"
		class="flex flex-col items-center justify-center text-center"
		class:text-secondary-300={$currentPage === 'home'}
	>
		<svg width="25" height="25" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M32.4327 27.5937L26.2183 21.3794C25.9378 21.0989 25.5576 20.9431 25.1587 20.9431H24.1427C25.863 18.7428 26.8853 15.9753 26.8853 12.9648C26.8853 5.80297 21.0823 0 13.9205 0C6.75872 0 0.95575 5.80297 0.95575 12.9648C0.95575 20.1265 6.75872 25.9295 13.9205 25.9295C16.9311 25.9295 19.6985 24.9073 21.8988 23.187V24.2029C21.8988 24.6019 22.0546 24.9821 22.3351 25.2626L28.5495 31.4769C29.1354 32.0628 30.0828 32.0628 30.6625 31.4769L32.4264 29.713C33.0123 29.1271 33.0123 28.1796 32.4327 27.5937ZM13.9205 20.9431C9.51373 20.9431 5.94219 17.3778 5.94219 12.9648C5.94219 8.55798 9.5075 4.98644 13.9205 4.98644C18.3273 4.98644 21.8988 8.55175 21.8988 12.9648C21.8988 17.3715 18.3335 20.9431 13.9205 20.9431Z"
				fill="currentColor"
			/>
		</svg>
		{$t('footer.menu.search')}
	</a>
	<a
		href="/words"
		class="relative bottom-2 flex flex-col items-center justify-center text-center text-lg before:absolute before:-top-8 before:-z-10 before:size-64 before:rounded-full before:bg-primary-700"
		class:text-secondary-300={$currentPage === 'words'}
	>
		<svg width="30" height="30" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.5 14.0625C16.3818 14.0625 19.5312 10.9131 19.5312 7.03125C19.5312 3.14941 16.3818 0 12.5 0C8.61816 0 5.46875 3.14941 5.46875 7.03125C5.46875 10.9131 8.61816 14.0625 12.5 14.0625ZM18.75 15.625H16.0596C14.9756 16.123 13.7695 16.4062 12.5 16.4062C11.2305 16.4062 10.0293 16.123 8.94043 15.625H6.25C2.79785 15.625 0 18.4229 0 21.875V22.6562C0 23.9502 1.0498 25 2.34375 25H22.6562C23.9502 25 25 23.9502 25 22.6562V21.875C25 18.4229 22.2021 15.625 18.75 15.625Z"
				fill="currentColor"
			/>
		</svg>
		{$t('footer.menu.words')}
	</a>
	<a
		href="#words"
		class="flex flex-col items-center justify-center text-center"
		class:text-secondary-300={$currentPage === 'study'}
	>
		<svg width="25" height="25" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M24.1471 0.00267299C21.7687 0.15575 17.0412 0.712928 14.1228 2.73885C13.9214 2.87864 13.8073 3.12721 13.8073 3.38709V21.297C13.8073 21.8655 14.3555 22.2249 14.8177 21.961C17.8203 20.2472 22.1628 19.7796 24.3099 19.6516C25.043 19.6078 25.6128 18.9413 25.6128 18.1425V1.51375C25.6133 0.642051 24.9466 -0.0485166 24.1471 0.00267299ZM12.1033 2.73885C9.18533 0.712928 4.4579 0.156242 2.07943 0.00267299C1.27995 -0.0485166 0.613281 0.642051 0.613281 1.51375V18.143C0.613281 18.9423 1.18316 19.6088 1.91623 19.6521C4.06424 19.7801 8.40885 20.2482 11.4115 21.963C11.8724 22.2263 12.4188 21.8675 12.4188 21.3005V3.37823C12.4188 3.11785 12.3051 2.87913 12.1033 2.73885Z"
				fill="currentColor"
			/>
		</svg>
		{$t('footer.menu.study')}
	</a>
</div>
