<script lang="ts">
	import { t } from '$lib/translations';

	let { open = $bindable(false) }: { open: boolean } = $props();
</script>

{#if open}
	<div
		class=" fixed left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
	>
		<div class="rounded-lg bg-white p-9 text-center">
			<h2 class="mx-4 mb-3 text-2xl font-semibold leading-5 text-slate-900">
				{$t('common.loginModal.title')}
			</h2>
			<h3 class="mx-4 mt-2 text-sm leading-4 text-slate-600">{$t('common.loginModal.subtitle')}</h3>
			<div class="mt-7 flex flex-col gap-2">
				<a class="h-10 rounded border border-slate-300 p-2 text-sm" href="/login">
					{$t('common.loginModal.login')}
				</a>
				<a class="h-10 rounded border border-slate-300 p-2 text-sm" href="/register">
					{$t('common.loginModal.register')}
				</a>
				<button
					class="h-10 w-full rounded border border-slate-300 p-2 text-sm"
					onclick={() => (open = false)}
				>
					{$t('common.button.cancel')}
				</button>
			</div>
		</div>
	</div>
{/if}
