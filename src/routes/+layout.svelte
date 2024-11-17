<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import '../app.css';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import { t } from '$lib/translations';
	import Footer from './Footer.svelte';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<svelte:head>
	<title>{$t('common.name')}</title>
</svelte:head>

<div class="flex h-dvh flex-col overflow-hidden">
	<Header {data} />

	<div class="flex-grow overflow-y-scroll">
		{@render children()}
	</div>

	<Footer />
</div>

<SvelteToast />
