<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let { pages, synchro, scrolltop = $bindable() } = $props();

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						console.log('intersecting', entry.target);
						let verse = entry.target
							.querySelector(`[data-verse]`)
							?.attributes['data-verse']?.value.split('.')[0];
						if (entry.target && verse && verse !== page.data.thirties) {
							goto(`${base}/fassungen/${verse}`, {
								noScroll: true,
								keepFocus: true,
								replaceState: true
							});
						}
					}
				});
			},
			{
				root: scrollContainer,
				rootMargin: '0px',
				threshold: [0, 1]
			}
		);
		const verse = scrollContainer?.querySelector(`[data-verse="${page.data.thirties}.01"]`);
		if (verse) {
			console.log('scrolling to', verse);
			scrollContainer?.scrollTo({
				top:
					scrollContainer?.scrollTop +
					Number(verse.parentElement?.getBoundingClientRect().top) -
					scrollContainer?.getBoundingClientRect().top,
				behavior: 'instant'
			});
		} else {
			console.log('no verse found');
		}
	});

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			observer.observe(node);
			return () => {
				observer.unobserve(node);
			};
		});
	};

	const setSyncedScroll = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (scrolltop) {
				node.scrollTo({ top: scrolltop, behavior: 'auto' });
			}
		});
	};
</script>

<div
	class="max-h-[70vh] overflow-y-auto"
	bind:this={scrollContainer}
	onscroll={(/** @type {{ target: { scrollTop: any; }; }} */ o) => {
		scrolltop = o?.target?.scrollTop;
	}}
	use:setSyncedScroll
>
	{#each pages as page (page[0])}
		{#if synchro}
			<div class="thirty tei-content" use:addToObserver>
				{@html page[1]}
			</div>
		{:else}
			<div class="thirty tei-content">
				{@html page[1]}
			</div>
		{/if}
		<hr class="!border-t-4 !border-primary-500" />
	{/each}
</div>

<style lang="postcss">
	.thirty {
		:global(.once) {
			-webkit-animation-iteration-count: 4;
			animation-iteration-count: 4;
		}
		:global(.line) {
			display: flex;
			gap: 1em;
			margin: 0.5em 0;
		}
		:global(.tei-cb) {
			@apply text-right mr-2;
		}
		:global(.tei-cb:not(.tei-cb:first-child)) {
			@apply border-primary-300 border-solid border-t-4;
		}
	}
</style>
