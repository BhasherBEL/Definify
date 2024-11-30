<script lang="ts">
	import LoginDialog from '$lib/components/LoginDialog.svelte';
	import toasts from '$lib/utils/toasts';
	import { get } from 'svelte/store';
	import { t } from '$lib/translations';

	let {
		word,
		definitions,
		isSaved = $bindable(),
		isLoggedIn
	}: { word: string; definitions: any; isSaved: boolean; isLoggedIn: boolean } = $props();

	let refs: Record<string, HTMLAudioElement | null> = {};
	let openLoginModal = $state(false);

	async function addToWordlist(word: string) {
		if (!isLoggedIn) {
			openLoginModal = true;
			return;
		}

		let previousIsSaved = isSaved;
		isSaved = true;

		const response = await fetch('/api/words', {
			method: 'POST',
			body: JSON.stringify({ word }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status !== 201) {
			toasts.alert(get(t)('common.words.error.save'), response.statusText);
			isSaved = previousIsSaved;
		}
	}

	async function removeFromWordlist(word: string) {
		if (!isLoggedIn) {
			openLoginModal = true;
			return;
		}

		let previousIsSaved = isSaved;
		isSaved = false;

		const response = await fetch(`/api/words/${word}`, {
			method: 'DELETE'
		});

		if (response.status !== 204) {
			toasts.alert(get(t)('common.words.error.remove'), response.statusText);
			isSaved = previousIsSaved;
		}
	}

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
</script>

{#each definitions as def}
	<div>
		<div class="bg-bg dark:bg-bg-dark flex h-24 flex-row justify-between py-4">
			<div class="font-serif text-6xl font-bold">
				{def.word}
			</div>
			<div class="flex items-center">
				<a href="/words/{word}" aria-label="External">
					<svg
						class="size-10 fill-none stroke-current stroke-1"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
						<polyline points="15 3 21 3 21 9" />
						<line x1="10" y1="14" x2="21" y2="3" />
					</svg>
				</a>
				<button
					aria-label="save"
					onclick={() => {
						isSaved ? removeFromWordlist(word) : addToWordlist(word);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="size-10 stroke-current stroke-1 hover:cursor-pointer"
						class:fill-text={isSaved}
						class:dark:fill-text-dark={isSaved}
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
		<div class="border-b-4 border-b-primary-600"></div>
		{#each def.meanings as meaning}
			<div
				class="bg-bg dark:bg-bg-dark my-4 border-b-2 border-b-secondary-200 text-xl text-primary-900 dark:border-b-secondary-900 dark:text-primary-300"
			>
				<span class="italic">{meaning.partOfSpeech}</span>
			</div>
			{#if (meaning.antonyms && meaning.antonyms.length > 0) || (meaning.synonyms && meaning.synonyms.length > 0)}
				<div class="mb-4 w-fit rounded-lg border p-2 opacity-70 dark:border-gray-500">
					{#if meaning.antonyms && meaning.antonyms.length > 0}
						<div class="text-lg">
							{$t('common.words.antonyms')}:
							<span class="italic">
								{#each meaning.antonyms as antonym}
									<a href={`/words/${antonym}`}>{antonym}</a>
									{#if antonym !== meaning.antonyms[meaning.antonyms.length - 1]}•
									{/if}
								{/each}
							</span>
						</div>
					{/if}
					{#if meaning.synonyms && meaning.synonyms.length > 0}
						<div class="text-lg">
							{$t('common.words.synonyms')}:
							<span class="italic">
								{#each meaning.synonyms as synonym}
									<a href={`/words/${synonym}`}>{synonym}</a>
									{#if synonym !== meaning.synonyms[meaning.synonyms.length - 1]}•
									{/if}
								{/each}
							</span>
						</div>
					{/if}
				</div>
			{/if}
			{#each meaning.definitions as mdef}
				<div class="mb-4 dark:text-white">
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
								{$t('common.words.synonyms')}:
								<span class="italic">
									{mdef.synonyms.join(', ')}
								</span>
							</div>
						{/if}
						{#if mdef.antonyms && mdef.antonyms.length > 0}
							<div>
								{$t('common.words.antonyms')}:
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
			<div class="border-t-2 border-t-primary-200 dark:border-t-primary-800">
				<div class="my-4 text-xl font-bold text-primary-900 dark:text-primary-300">
					{$t('common.words.sources')}
				</div>
				<ul class="list-inside list-disc">
					{#each def.sourceUrls as sourceUrl}
						<li>
							<a
								href={sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-700 hover:underline dark:text-blue-300"
							>
								{sourceUrl}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{/each}

<LoginDialog bind:open={openLoginModal} />
