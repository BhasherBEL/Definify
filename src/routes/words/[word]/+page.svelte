<script lang="ts">
	import Word from '$lib/components/Word.svelte';

	let { data } = $props();

	let isSaved = $state(data.saved);
</script>

<div class="mx-2 mb-8 px-2 md:mx-auto md:w-[64rem]">
	<Word bind:isSaved word={data.word} definitions={data.definition} isLoggedIn={!!data.user} />
</div>
