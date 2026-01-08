<script>
	export let clampClass = 'line-clamp-3';  // pass any Tailwind CSS clamp class to clamp content

	$: ({ class: hostClass = '', ...rest } = $$restProps);

	export let labelMore = 'Mehr anzeigen';
	export let labelLess = 'Weniger anzeigen';

	let open = false;

	const contentId =
		typeof crypto !== 'undefined' && crypto.randomUUID
			? `expandable-${crypto.randomUUID()}`
			: `expandable-${Math.random().toString(36).slice(2)}`;

	$: ({ class: hostClass = '', ...rest } = $$restProps);
</script>

<div class={`w-full ${hostClass}`} {...rest}>
	<div
		id={contentId}
		class={`${clampClass}`}
		class:line-clamp-none={open}
	>
		<slot />
	</div>
	<button
		type="button"
		class="mt-4 text-sm font-semibold anchor-font-color"
		aria-controls={contentId}
		aria-expanded={open}
		on:click={() => (open = !open)}
	>
		{open ? labelLess : labelMore}
	</button>
</div>
