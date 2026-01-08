<script>
	import { base } from '$app/paths';

	let { href = '', label = '', class: hostClass = '', children, ...rest } = $props();
</script>

<div
	class={`relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-4 w-[25em] ml-8 mb-12 ${hostClass}`}
	{...rest}
>
	{#if label && href}
		<a
			href={`${base}${href}`}
			target="_blank"
			rel="noopener noreferrer"
			class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 anchor text-sm font-medium rounded-md border border-primary-200 shadow-sm"
		>
			{label}
		</a>
	{/if}

	<div class="tei-content">
		<span class="tei-content">
			{@render children()}
		</span>
	</div>
</div>
