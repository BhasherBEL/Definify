<script lang="ts">
	import { RegisterForm } from '@bhasher/svelte-auth';
	import { t } from '$lib/translations';
</script>

<section class="md:h-full">
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-full">
		<RegisterForm {t} />
	</div>
</section>
