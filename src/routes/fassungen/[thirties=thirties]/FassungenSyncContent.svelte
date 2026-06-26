<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let {
		content,
		titles,
		nextPrevButton,
		distributions,
		resetPopup = () => {},
		fassungenVisible = [true, true, true, true]
	} = $props();
	const thirtiesNum = $derived(Number(page.data.thirties));

	const columnKeys = /** @type {const} */ (['d', 'm', 'G', 'T']);
	let visibleCount = $derived(fassungenVisible.filter(Boolean).length || 1);
	let firstVisibleIndex = $derived(fassungenVisible.findIndex(Boolean));
	// 1-based grid-column index per Fassung among the currently visible columns.
	// Hidden Fassungen aren't rendered in the markup, so their value just needs
	// to be a valid grid-column integer (we use 1).
	let columnStyleVars = $derived.by(() => {
		let idx = 0;
		return columnKeys
			.map((k, i) => {
				const col = fassungenVisible[i] ? ++idx : 1;
				return `--col-${k}: ${col};`;
			})
			.join(' ');
	});

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(async () => {
		// update the current page when a new verse comes into view
		observer = createObserver(true, scrollContainer, page);
	});

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (!correctPos) {
				const targetVerse = node.parentElement?.querySelector(
					`[data-verse="${page.data.thirties}.01"]`
				);
				if (scrollContainer && targetVerse) {
					scrollContainer?.scrollTo({
						top:
							scrollContainer?.scrollTop +
							Number(targetVerse.parentElement?.getBoundingClientRect().top) -
							scrollContainer?.getBoundingClientRect().top,
						behavior: 'instant'
					});
					correctPos = true;
				}
			}
			observer.observe(node);
			return () => {
				observer.unobserve(node);
			};
		});
	};
	let correctPos = $state(false);

	$effect(() => {
		if (!content[0]?.length && correctPos) {
			correctPos = false;
		}
	});
</script>

<div
	class="grid gap-4 mb-2"
	class:lg:grid-cols-1={visibleCount === 1}
	class:lg:grid-cols-2={visibleCount === 2}
	class:lg:grid-cols-3={visibleCount === 3}
	class:lg:grid-cols-4={visibleCount === 4}
>
	{#each content as _fassung, i}
		{#if fassungenVisible[i]}
			<div>
				<h2 class="h3 inline-flex">
					{titles[i]}
					{#if titles[i].includes('T')}
						{#if thirtiesNum >= 36 && thirtiesNum <= 157}
							<span>(U)</span>
						{:else if (thirtiesNum >= 573 && thirtiesNum <= 599) || (thirtiesNum >= 643 && thirtiesNum <= 678)}
							<span>(Q)</span>
						{/if}
					{/if}
				</h2>
				<div class="inline [&_ul,&_li]:inline [&_li]:mr-1 anchor">
					{@html distributions[i][page.data.thirties]}
				</div>
			</div>
		{/if}
	{/each}
</div>
<!-- Scrollable region needs tabindex so keyboard-only users can focus and scroll it with arrow keys (WCAG 2.1.1). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="grid gap-x-4 mb-2 tei-content synced grid-flow-dense lg:h-[calc(100vh-5rem)] lg:overflow-y-auto"
	class:lg:grid-cols-1={visibleCount === 1}
	class:lg:grid-cols-2={visibleCount === 2}
	class:lg:grid-cols-3={visibleCount === 3}
	class:lg:grid-cols-4={visibleCount === 4}
	style={columnStyleVars}
	bind:this={scrollContainer}
	tabindex="0"
	role="region"
	aria-label="Synchron gescrollte Fassungen"
	onscroll={() => {
		resetPopup();
	}}
>
	{#each content as fassung, i}
		{@const column = columnKeys[i]}
		{#if fassungenVisible[i]}
			{#if fassung[0] && fassung[0][0] > 1}
				{@render nextPrevButton(false, fassung[0][0] - 1, column)}
			{/if}
			{#each fassung as page (page[0])}
				{@html page[1]}
				{#if i === firstVisibleIndex}
					<hr class="!border-t-4 !border-primary-500 column-{column}" use:addToObserver />
				{:else}
					<hr class="!border-t-4 !border-primary-500 column-{column}" />
				{/if}
			{/each}
			{#if fassung[fassung.length - 1] && fassung[fassung.length - 1][0] < NUMBER_OF_PAGES}
				{@render nextPrevButton(true, fassung[fassung.length - 1][0] + 1, column)}
			{/if}
		{/if}
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	@reference "@skeletonlabs/skeleton/optional/presets";

	.synced {
		:global(.line) {
			@apply grid grid-cols-(--verse-width) grid-flow-col items-center-safe;
			@apply preset-filled-surface-500;
			:global(.verse) {
				@apply ml-1;
			}
		}
		/* Visible columns reflow when Fassungen are hidden via the sidebar
		   toggles: --col-d/m/G/T are set as inline CSS variables on this
		   container and updated by columnStyleVars. */
		@variant lg {
			:global(.column-d) {
				grid-column: var(--col-d);
			}
			:global(.column-m) {
				grid-column: var(--col-m);
			}
			:global(.column-G) {
				grid-column: var(--col-G);
			}
			:global(.column-T) {
				grid-column: var(--col-T);
			}
		}
	}
</style>
