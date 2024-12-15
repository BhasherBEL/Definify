<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import '../app.css';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import { t } from '$lib/translations';
	import Footer from './Footer.svelte';
	import { onMount } from 'svelte';
	import theme from '$lib/components/theme.svelte';

	let { data, children }: { data: LayoutData; children: any } = $props();

	theme.dark = data.theme === 'dark' || data.theme == 'auto-dark';

	onMount(() => {
		const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (data.theme === 'auto-light' && systemDark) {
			theme.dark = true;
		} else if (data.theme === 'auto-dark' && !systemDark) {
			theme.dark = false;
		}
	});

	$effect(() => {
		if (window) {
			document.cookie = 'system-dark=' + theme.dark;
		}
	});
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
</svelte:head>

<div
	class="flex h-dvh flex-col overflow-hidden bg-bg text-text dark:bg-bg-dark dark:text-text-dark"
	class:dark={theme.dark}
>
	<div class="flex flex-grow flex-col overflow-y-scroll">
		<Header {data} />
		{@render children()}
	</div>

	<Footer />
</div>

<SvelteToast />
