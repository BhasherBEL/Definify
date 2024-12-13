<script lang="ts">
	import { LoginForm } from '@bhasher/svelte-auth';
	import type { ActionData } from './$types';
	import { t } from '$lib/translations';

	const { form }: { form: ActionData } = $props();
</script>

<section class="h-full">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-full">
		<LoginForm {form} {t} />
	</div>
</section>
