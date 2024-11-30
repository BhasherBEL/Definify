<script lang="ts">
	import { t } from '$lib/translations';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Word from '$lib/components/Word.svelte';

	let { form, data }: { data: PageData; form: ActionData } = $props();

	let searchBar: HTMLInputElement;
	let searchBarFocused = $state(false);
	let search = $state('');
	let error: string | undefined = $state();

	let searching = $state(false);
	let searchResult: { saved: boolean; word: string; definition: string } | undefined = $state(
		form?.searchResult
	);

	async function enhanced() {
		searching = true;
		searchBar.blur();
		search = '';
		return async ({ result }: any) => {
			if (result.type == 'success' && result.data) {
				searchResult = result.data;
				error = '';
			} else if (result.type == 'failure') {
				if (result.data.notFound) error = $t('home.error.notFound', { word: result.data.word });
				else if (result.data.invalid) error = $t('home.error.invalid');
				else error = $t('home.error.generic');
				searchResult = undefined;
			}
			searching = false;
		};
	}
</script>

<svelte:window
	onkeydowncapture={(e) => {
		if (e.key === '/' && searchBar) {
			e.preventDefault();
			searchBar.focus();
		} else if (
			searchBar &&
			searchBarFocused &&
			(e.key === 'Escape' || (e.key === 'Enter' && search === ''))
		) {
			searchBar.blur();
		}
	}}
/>

<div class="pb-8 md:mx-auto md:max-w-5xl">
	<form
		class="mx-auto mt-5 max-w-5xl px-2 md:mb-8 md:mt-16"
		action="?/search"
		method="POST"
		use:enhance={enhanced}
	>
		<div class="relative z-20">
			<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
				<svg
					class="h-4 w-4 opacity-60"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 20 20"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
					/>
				</svg>
			</div>
			<div class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
				<kbd
					class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
				>
					{searchBarFocused ? 'Enter' : '/'}
				</kbd>
			</div>
			<input
				bind:this={searchBar}
				onfocusin={() => (searchBarFocused = true)}
				onfocusout={() => (searchBarFocused = false)}
				type="search"
				id="search"
				name="search"
				bind:value={search}
				class="input-text !py-4 !pe-20 !ps-10"
				maxlength="50"
				placeholder={$t('home.search.placeholder')}
				autocomplete="off"
				required
			/>
		</div>
	</form>

	<div class="mx-auto my-4 max-w-5xl px-2">
		{#if searching}
			<div class="text-center">
				<div class="loading-bars"></div>
			</div>
		{:else if error}
			<div
				class="rounded border border-red-600 bg-red-50 p-2 text-center text-red-900 dark:bg-red-900 dark:text-red-200"
			>
				{error}
			</div>
		{/if}
	</div>

	<div class="z-0 px-2">
		{#if searchResult}
			<Word
				isSaved={searchResult.saved}
				word={searchResult.word}
				definitions={searchResult.definition}
				isLoggedIn={!!data.user}
			/>
		{/if}
	</div>

	<div class="my-4 flex p-2 italic">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="animate-spin-frac h-5 w-5"
			fill="currentColor"
			viewBox="0 0 448 512"
			><path
				d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96c0-35.35-28.65-64-64-64zm16 384c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16v320zM128 128c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm96 96c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm-96 96c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm192-192c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm0 192c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"
			></path></svg
		>
		<div class="ml-2">
			{$t('home.suggestions')}
		</div>
	</div>

	<div
		class="no-scrollbar flex w-full flex-1 snap-x snap-mandatory space-x-2 overflow-x-scroll px-4 md:grid md:grid-cols-7 md:px-2"
	>
		{#each data.suggestions as suggestion (suggestion.id)}
			<form
				action="?/search"
				method="POST"
				use:enhance={enhanced}
				class="bg-zone dark:bg-zone-dark col-span-2 h-32 flex-[0_0_90vw] snap-center overflow-y-hidden rounded-xl border md:flex-[0_0_32rem] dark:border-neutral-600"
			>
				<input type="search" id="search" name="search" value={suggestion.word} class="hidden" />
				<button class="flex size-full flex-col p-2 text-left align-top">
					<div class="mb-2">
						<span class="font-bold capitalize">{suggestion.word}</span>
						<span class="float-right mr-2 italic opacity-50">{suggestion.partOfSpeech}</span>
					</div>
					<div class="">{suggestion.definition}</div>
				</button>
			</form>
		{/each}
		<form action="?/suggestions" method="POST" use:enhance>
			<button
				class="size-full animate-pulse rounded-xl border-2 border-dashed border-neutral-300 hover:bg-gray-500 hover:bg-opacity-10 dark:border-neutral-600"
			>
				{$t('home.newSuggestions')}
			</button>
		</form>
	</div>
</div>

<div
	class="absolute bottom-0 left-0 right-0 top-0 z-10 bg-white bg-opacity-40 backdrop-blur dark:bg-black dark:bg-opacity-40"
	class:hidden={!searchBarFocused}
></div>
