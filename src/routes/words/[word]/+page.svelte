<script lang="ts">
	import Word from '$lib/components/Word.svelte';

	let { data } = $props();

	let isSaved = $state(data.saved);
</script>

<div class="mx-2 mb-8 max-w-5xl lg:mx-auto">
	<Word bind:isSaved word={data.word} definitions={data.definition} isLoggedIn={!!data.user} />
</div>
