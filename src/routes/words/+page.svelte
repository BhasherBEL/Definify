<script lang="ts">
	import { t } from '$lib/translations';

	let { data } = $props();

	let words: { word: string; n_definitions: number; audio: string }[] = data.words.map((item) => ({
		word: item.word,
		n_definitions: item.definition.reduce(
			(total: number, definition: any) =>
				total +
				definition.meanings.reduce(
					(t1: number, meaning: any) => t1 + meaning.definitions.length,
					0
				),
			0
		),
		audio: item.definition
			.find((definition: any) => definition.phonetics.find((phonetic: any) => phonetic.audio))
			?.phonetics.find((phonetic: any) => phonetic.audio)?.audio
	}));

	let refs: Record<string, HTMLAudioElement | null> = {};

	function togglePlay(audioElement: HTMLAudioElement | null) {
		if (!audioElement) return;
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

<div class="mt-4">
	{#each words as word}
		<a
			href={`/words/${word.word}`}
			class="m-2 flex items-center rounded-lg border p-4 py-2 shadow-[0_0_6px_0_rgba(0,14,156,.2)]"
		>
			<div class="text-xl capitalize">{word.word}</div>
			<div class="flex flex-grow items-center justify-end gap-5">
				<span class="text-sm lowercase italic text-gray-500">
					{word.n_definitions}
					{$t('common.words.definitions')}
				</span>
				{#if word.audio}
					<button
						aria-label="audio"
						onclick={(e) => {
							e.preventDefault();
							togglePlay(refs[word.audio]);
						}}
					>
						<audio bind:this={refs[word.audio]} src={word.audio}></audio>
						<svg class="size-5" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9.3329 2.97236L5.47135 6.83304H1.04167C0.466146 6.83304 0 7.29919 0 7.87471V14.1247C0 14.6998 0.466146 15.1664 1.04167 15.1664H5.47135L9.3329 19.0271C9.98524 19.6794 11.1111 19.2211 11.1111 18.2905V3.70891C11.1111 2.77749 9.98438 2.32089 9.3329 2.97236ZM19.4596 0.75535C18.9748 0.437208 18.3233 0.571322 18.0052 1.057C17.6866 1.54181 17.822 2.19328 18.3069 2.51143C21.1832 4.39901 22.8997 7.57219 22.8997 11.0001C22.8997 14.4281 21.1832 17.6013 18.3069 19.4889C17.822 19.8066 17.6866 20.4585 18.0052 20.9429C18.3108 21.4077 18.957 21.5748 19.4596 21.2445C22.9284 18.9676 25 15.1373 25 10.9997C25 6.86212 22.9284 3.03226 19.4596 0.75535ZM20.8333 10.9997C20.8333 8.24233 19.4418 5.70717 17.1107 4.21846C16.625 3.90856 15.9809 4.05266 15.6732 4.54224C15.3654 5.03183 15.5091 5.67983 15.9948 5.99016C17.7201 7.09216 18.75 8.96455 18.75 10.9997C18.75 13.0349 17.7201 14.9073 15.9948 16.0093C15.5091 16.3192 15.3654 16.9672 15.6732 17.4572C15.9557 17.9068 16.5898 18.1143 17.1107 17.781C19.4418 16.2922 20.8333 13.7575 20.8333 10.9997ZM14.6801 7.66334C14.1775 7.3886 13.5434 7.56959 13.2648 8.07349C12.9874 8.5774 13.171 9.21065 13.6749 9.48886C14.2352 9.79658 14.5833 10.376 14.5833 10.9997C14.5833 11.6238 14.2352 12.2028 13.6753 12.5106C13.1714 12.7888 12.9878 13.422 13.2652 13.9259C13.5443 14.432 14.1788 14.6117 14.6806 14.3361C15.9058 13.6612 16.6671 12.383 16.6671 10.9993C16.6671 9.61559 15.9058 8.33782 14.6801 7.66334Z"
								fill="currentColor"
							/>
						</svg>
					</button>
				{:else}
					<svg class="size-5" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M10.4995 0.46928L6.15527 4.81254H1.17188C0.524414 4.81254 0 5.33696 0 5.98442V13.0157C0 13.6626 0.524414 14.1875 1.17188 14.1875H6.15527L10.4995 18.5308C11.2334 19.2647 12.5 18.7491 12.5 17.7022V1.29789C12.5 0.250041 11.2324 -0.26363 10.4995 0.46928ZM22.541 9.50004L24.7695 7.27153C25.0771 6.96391 25.0771 6.46488 24.7695 6.15727L23.6553 5.04301C23.3477 4.73539 22.8486 4.73539 22.541 5.04301L20.3125 7.27153L18.084 5.04301C17.7764 4.73539 17.2773 4.73539 16.9697 5.04301L15.8555 6.15727C15.5479 6.46488 15.5479 6.96391 15.8555 7.27153L18.084 9.50004L15.856 11.7281C15.5483 12.0357 15.5483 12.5347 15.856 12.8423L16.9702 13.9566C17.2778 14.2642 17.7769 14.2642 18.0845 13.9566L20.3125 11.7286L22.541 13.9571C22.8486 14.2647 23.3477 14.2647 23.6553 13.9571L24.7695 12.8428C25.0771 12.5352 25.0771 12.0362 24.7695 11.7286L22.541 9.50004Z"
							fill="gray"
						/>
					</svg>
				{/if}
				<span class="size-fit">
					<svg
						class="size-3 -rotate-90"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 10 6"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 4 4 4-4"
						/>
					</svg>
				</span>
			</div>
		</a>
	{/each}
</div>
