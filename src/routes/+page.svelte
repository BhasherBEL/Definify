<script lang="ts">
	import { t } from '$lib/translations';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { data: PageData; form: ActionData } = $props();

	let searching = $state(false);
</script>

<div class="mx-4">
	<form
		class="mx-auto mt-5 max-w-5xl md:mb-8 md:mt-16"
		action="?/search"
		method="POST"
		use:enhance={() => {
			searching = true;
			return async ({ update }) => {
				await update();
				searching = false;
			};
		}}
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

	<div class="mx-auto my-4 max-w-5xl">
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

	<div class="py-2">{$t('home.suggestions')}</div>

	<div
		class="no-scrollbar -mx-4 flex flex-1 snap-x snap-mandatory space-x-2 overflow-x-scroll px-4 md:grid md:grid-cols-4"
	>
		{#each data.suggestions as suggestion (suggestion.id)}
			<a
				class="h-32 flex-[0_0_90vw] snap-center overflow-y-hidden rounded-lg border bg-white p-2 md:flex-[0_0_32rem] dark:border-neutral-950 dark:bg-gray-700"
				href="/words/{suggestion.word}"
			>
				<div class="mb-2">
					<span class="font-bold capitalize">{suggestion.word}</span>
					<span class="float-right mr-2 italic opacity-50">{suggestion.partOfSpeech}</span>
				</div>
				<div class="">{suggestion.definition}</div>
			</a>
		{/each}
	</div>
</div>
