<script lang="ts">
	import type { ActionData } from './$types';
	import LoginForm from '$lib/components/LoginForm.svelte';

	const { form }: { form: ActionData } = $props();
</script>

<section class="h-full">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-full">
		<LoginForm {form} />
	</div>
</section>
