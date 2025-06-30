<script>
	import { onMount } from 'svelte';
	import {
		FloatingArrow,
		arrow,
		autoUpdate,
		flip,
		offset,
		shift,
		useClick,
		useDismiss,
		useFloating,
		useInteractions,
		useRole
	} from '@skeletonlabs/floating-ui-svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let { content, titles, nextPrevButton, distributions } = $props();
	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(async () => {
		// update the current page when a new verse comes into view
		observer = createObserver(true, scrollContainer, page);
	});

	let open = $state(false);
	let elemArrow = $state(null);

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => {
			open = v;
		},
		placement: 'top',
		get middleware() {
			return [offset(10), flip(), shift(), elemArrow && arrow({ element: elemArrow })];
		}
	});
	// Interactions
	const role = useRole(floating.context);
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);

	function attachProps(node, props) {
		const listeners = [];

		for (const [key, value] of Object.entries(props)) {
			const isEvent = key.startsWith('on') && key.length > 2 && key[2] === key[2].toUpperCase();
			if (isEvent && typeof value === 'function') {
				const eventName = key.slice(2).toLowerCase();
				console.log('attaching event', eventName, value);
				node.addEventListener(eventName, value);
				listeners.push({ event: eventName, handler: value });
			} else if (value !== undefined) {
				node.setAttribute(key, value);
			}
		}

		return {
			destroy() {
				for (const { event, handler } of listeners) {
					node.removeEventListener(event, handler);
				}
			}
		};
	}

	const attachListeners = (node) => {
		$effect(() => {
			const links = node.querySelectorAll('a');
			links.forEach((link) => {
				floating.elements.reference = link;
				attachProps(link, interactions.getReferenceProps());
			});
		});
	};

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (!correctPos) {
				const targetVerse = node.parentElement?.querySelector(
					`[data-verse="${page.data.thirties}.01"]`
				);
				if (targetVerse) {
					targetVerse?.scrollIntoView({
						behavior: 'instant',
						block: 'start'
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
	let correctPos = false;

	$effect(() => {
		if (!content[0]?.length && correctPos) {
			correctPos = false;
		}
	});
</script>

{#if open}
	<div
		class="card preset-filled-primary-500 p-4 unstyled max-w-[99ch]"
		transition:fade={{ duration: 200 }}
	>
		content
		<FloatingArrow
			bind:ref={elemArrow}
			context={floating.context}
			fill="var(--color-primary-500)"
		/>
	</div>
{/if}
<div class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 my-4">
	{#each content as _fassung, i}
		<div>
			<h2 class="h2 inline">{titles[i]}</h2>
			<div class="inline [&_ul,&_li]:inline [&_li]:mr-1">
				{@html distributions[i][page.data.thirties]}
			</div>
		</div>
	{/each}
</div>
<div
	class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-4 my-4 tei-content synced grid-flow-dense max-h-[70vh] overflow-y-auto"
	bind:this={scrollContainer}
>
	{#each content as fassung, i}
		{@const column = ['d', 'm', 'G', 'T'][i]}
		{#if fassung[0] && fassung[0][0] > 1}
			{@render nextPrevButton(false, fassung[0][0] - 1, column)}
		{/if}
		{#each fassung as page (page[0])}
			<div class="contents" use:attachListeners>
				{@html page[1]}
			</div>
			{#if i === 0}
				<hr class="!border-t-4 !border-primary-500 column-{column}" use:addToObserver />
			{:else}
				<hr class="!border-t-4 !border-primary-500 column-{column}" />
			{/if}
		{/each}
		{#if fassung[fassung.length - 1] && fassung[fassung.length - 1][0] < NUMBER_OF_PAGES}
			{@render nextPrevButton(true, fassung[fassung.length - 1][0] + 1, column)}
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
		:global(.line:first-child) {
			@apply rounded-t-xl;
		}
		@variant md {
			:global(.column-d) {
				grid-column: 1;
			}
			:global(.column-m) {
				grid-column: 2;
			}
			:global(.column-G) {
				grid-column: 3;
			}
			:global(.column-T) {
				grid-column: 4;
			}
			:global(:nth-child(1 of .column-T)),
			:global(:nth-child(1 of .column-G)),
			:global(:nth-child(1 of .column-m)),
			:global(:nth-child(1 of .column-d)) {
				@apply rounded-t-xl;
			}
			:global(:nth-last-child(1 of .column-T)),
			:global(:nth-last-child(1 of .column-G)),
			:global(:nth-last-child(1 of .column-m)),
			:global(:nth-last-child(1 of .column-d)) {
				@apply rounded-b-xl;
			}
		}
	}
</style>
