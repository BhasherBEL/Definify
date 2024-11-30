<script lang="ts">
	import { t } from '$lib/translations';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Word from '$lib/components/Word.svelte';

	let { form, data }: { data: PageData; form: ActionData } = $props();

	let searching = $state(false);
	let searchResult: { saved: boolean; word: string; definition: string } | undefined = $state(
		form?.searchResult
	);

	async function enhanced() {
		searching = true;
		return async ({ result }: any) => {
			if (result.type == 'success' && result.data) searchResult = result.data;
			searching = false;
		};
	}
</script>

<div class="pb-8 md:mx-auto md:max-w-5xl">
	<form
		class="mx-auto mt-5 max-w-5xl px-2 md:mb-8 md:mt-16"
		action="?/search"
		method="POST"
		use:enhance={enhanced}
	>
		<div class="relative">
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
			<input
				type="search"
				id="search"
				name="search"
				value={form?.word || ''}
				class="input-text !py-4 !ps-10"
				placeholder={$t('home.search.placeholder')}
				autocomplete="off"
				required
			/>
		</div>
	</form>

	<div class="mx-auto my-4 max-w-5xl px-2">
		{#if form?.notFound && form?.word}
			<div class="rounded border border-red-600 bg-red-50 p-2 text-center text-red-900">
				{$t('home.error.notFound', { word: form.word })}
			</div>
		{:else if form?.invalid}
			<div
				class="mx-auto max-w-5xl rounded border border-red-600 bg-red-50 p-2 text-center text-red-900"
			>
				{$t('home.error.invalid')}
			</div>
		{:else if searching}
			<div class="text-center">
				<div class="loading-bars"></div>
			</div>
		{/if}
	</div>

	<div class="px-2">
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
				class="border-zone size-full animate-pulse rounded-xl border-2 border-dashed hover:bg-gray-500 hover:bg-opacity-10 dark:border-neutral-600"
			>
				{$t('home.newSuggestions')}
			</button>
		</form>
	</div>
</div>
