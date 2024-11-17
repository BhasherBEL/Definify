<script lang="ts">
	import { t } from '$lib/translations';
	import { enhance } from '$app/forms';
	import type { LayoutData } from './$types';
	import Word from '$lib/components/Word.svelte';

	let { form, data }: { data: LayoutData; form: FormData } = $props();

	let wordIsSaved = $state(form?.saved || false);

	$effect(() => (wordIsSaved = form?.saved));
</script>

<div class="mx-4 mt-24 text-center font-serif text-4xl italic lg:text-5xl">{$t('home.slogan')}</div>

<div class="mx-4">
	<form class="mx-auto mt-16 max-w-5xl" action="?/search" method="POST" use:enhance>
		<label
			for="default-search"
			class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>
			{$t('home.search.button')}
		</label>
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 start-0 hidden items-center ps-3 lg:flex">
				<svg
					class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pe-16 text-center text-xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 lg:ps-10 lg:text-4xl"
				placeholder={$t('home.search.placeholder')}
				autocomplete="off"
				required
			/>
			<button
				type="submit"
				class="absolute end-0 top-0 h-full rounded-e-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				{$t('home.search.button')}
			</button>
		</div>
	</form>

	<div class="mx-auto my-12 max-w-5xl">
		{#if form?.notFound && form?.word}
			<div class="rounded border border-red-600 bg-red-50 p-2 text-center text-red-900">
				{$t('home.error.notFound', { word: form.word })}
			</div>
		{:else if form?.apiError}
			<div
				class="mx-auto max-w-5xl rounded border border-red-600 bg-red-50 p-2 text-center text-red-900"
			>
				{$t('home.error.api')}
			</div>
		{:else if form?.invalid}
			<div
				class="mx-auto max-w-5xl rounded border border-red-600 bg-red-50 p-2 text-center text-red-900"
			>
				{$t('home.error.invalid')}
			</div>
		{:else if form?.unauthorized}
			<div
				class="mx-auto max-w-5xl rounded border border-red-600 bg-red-50 p-2 text-center text-red-900"
			>
				{$t('home.error.unauthorized')}
			</div>
		{:else if form?.definition}
			<Word
				bind:isSaved={wordIsSaved}
				word={form?.word}
				definitions={form.definition}
				isLoggedIn={!!data.user}
			/>
		{/if}
	</div>
</div>
