<script lang="ts">
	import { t } from '$lib/translations';
	import { enhance } from '$app/forms';
	import toasts from '$lib/utils/toasts.js';
	import { get } from 'svelte/store';

	let { form } = $props();

	let wordIsSaved = $state(form?.saved || false);

	let refs: Record<string, HTMLAudioElement | null> = {};

	function togglePlay(audioElement: HTMLAudioElement) {
		if (audioElement.paused) {
			document.querySelectorAll('audio').forEach((audio) => {
				if (!audio.paused && audio !== audioElement) {
					(audio as HTMLAudioElement).pause();
				}
			});
			audioElement.load();
			audioElement.play();
		} else {
			audioElement.pause();
		}
	}

	async function addToWordlist(word: string) {
		const response = await fetch('/api/words', {
			method: 'POST',
			body: JSON.stringify({ word }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status === 201) {
			toasts.success(get(t)('home.saved'));
			wordIsSaved = true;
		} else {
			toasts.alert(get(t)('home.error.save'), response.statusText);
		}
	}

	async function removeFromWordlist(word: string) {
		const response = await fetch(`/api/words/${word}`, {
			method: 'DELETE'
		});

		if (response.status === 204) {
			toasts.success(get(t)('home.removed'));
			wordIsSaved = false;
		} else {
			toasts.alert(get(t)('home.error.remove'), response.statusText);
		}
	}
</script>

<div class="mt-24 text-center font-['SourGrummy'] text-4xl">{$t('home.slogan')}</div>

<div class="mx-4">
	<form class="mx-auto mt-16 max-w-5xl" action="?/search" method="POST" use:enhance>
		<label
			for="default-search"
			class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>
			{$t('home.search.button')}
		</label>
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
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
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-center text-4xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
			{#each form?.definition as def}
				<div class="border-b-primary-600 border-b-4">
					<div class="flex flex-row justify-between py-4">
						<div class="font-serif text-6xl font-bold">
							{def.word}
						</div>
						<div class="flex items-center text-gray-600">
							<button
								aria-label="save"
								onclick={() => {
									wordIsSaved ? removeFromWordlist(def?.word) : addToWordlist(def.word);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-10 hover:cursor-pointer"
									class:fill-black={wordIsSaved}
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
									/>
								</svg>
							</button>
						</div>
					</div>
					<div class="flex gap-4 space-y-4 space-y-reverse text-xl">
						{#each def.phonetics as phonetic}
							{#if phonetic.text}
								<span>{phonetic.text}</span>
							{/if}
							{#if phonetic.audio && phonetic.sourceUrl}
								<audio bind:this={refs[phonetic.sourceUrl]} src={phonetic.audio}></audio>
								<button onclick={() => togglePlay(refs[phonetic.sourceUrl]!)} aria-label="Play">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
										/>
									</svg>
								</button>
							{/if}
						{/each}
					</div>
				</div>
				{#each def.meanings as meaning}
					<div class="border-b-secondary-200 text-primary-900 my-4 border-b-2 text-xl">
						<span class="font-bold">{def.word}</span>
						•
						<span class="italic">{meaning.partOfSpeech}</span>
					</div>
					{#if (meaning.antonyms && meaning.antonyms.length > 0) || (meaning.synonyms && meaning.synonyms.length > 0)}
						<div class="mb-4 w-fit rounded-lg border p-2 text-gray-700">
							{#if meaning.antonyms && meaning.antonyms.length > 0}
								<div class="text-lg">
									{$t('home.antonyms')}:
									<span class="italic">
										{#each meaning.antonyms as antonym}
											<form class="inline" action="?/search" method="POST" use:enhance>
												<input type="search" hidden name="search" value={antonym} />
												<button>{antonym}</button>
											</form>
											{#if antonym !== meaning.antonyms[meaning.antonyms.length - 1]}•
											{/if}
										{/each}
									</span>
								</div>
							{/if}
							{#if meaning.synonyms && meaning.synonyms.length > 0}
								<div class="text-lg">
									{$t('home.synonyms')}:
									<span class="italic">
										{#each meaning.synonyms as synonym}
											<form class="inline" action="?/search" method="POST" use:enhance>
												<input type="search" hidden name="search" value={synonym} />
												<button>{synonym}</button>
											</form>
											{#if synonym !== meaning.synonyms[meaning.synonyms.length - 1]}•
											{/if}
										{/each}
									</span>
								</div>
							{/if}
						</div>
					{/if}
					{#each meaning.definitions as mdef}
						<div class="mb-4">
							<div class="mb-1 text-lg">
								{mdef.definition}
							</div>
							<div class="border-l-4 border-stone-200 pl-2">
								{#if mdef.example}
									<div class="italic">
										{mdef.example}
									</div>
								{/if}
								{#if mdef.synonyms && mdef.synonyms.length > 0}
									<div>
										{$t('home.synonyms')}:
										<span class="italic">
											{mdef.synonyms.join(', ')}
										</span>
									</div>
								{/if}
								{#if mdef.antonyms && mdef.antonyms.length > 0}
									<div>
										{$t('home.antonyms')}:
										<span class="italic">
											{mdef.antonyms.join(', ')}
										</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{/each}
				{#if def.sourceUrls && def.sourceUrls.length > 0}
					<div class="border-t-primary-200 border-t-2">
						<div class="text-primary-900 my-4 text-xl font-bold">
							{$t('home.sources')}
						</div>
						<ul class="list-inside list-disc">
							{#each def.sourceUrls as sourceUrl}
								<li>
									<a
										href={sourceUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-700 hover:underline"
									>
										{sourceUrl}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</div>
