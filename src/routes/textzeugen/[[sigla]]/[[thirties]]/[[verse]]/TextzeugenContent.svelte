<script>
	import { onMount } from 'svelte';
	/** @type {{pages: any}} */
	let { pages, localPageChange, localIiifChange, localVerseChange, targetverse } = $props();
	let localTarget;
	/**
	 * @type {number | null}
	 */
	let timer = $state(null);

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
						localPageChange(entry.target.dataset);
					}
				});
			},
			{
				root: scrollContainer,
				rootMargin: '0px',
				threshold: [0, 1]
			}
		);
	});

	let programmaticScroll = $state(false);
	let oldHeight = $state(0);

	const onScrollEnd = (/** @type { Event & { target: HTMLElement}} } */ e) => {
		if (programmaticScroll || scrollContainer.scrollHeight > oldHeight) {
			programmaticScroll = false;
			oldHeight = scrollContainer.scrollHeight;
		} else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				const positive = (/** @type {string} */ verse) => {
					localVerseChange(verse);
				};
				const /** @type { NodeListOf<HTMLElement> } */ verses =
						e.target?.querySelectorAll('.verse');
				let found = false;
				for (let i = 0; i < verses.length; i++) {
					const verse = verses[i];
					if (
						verse.getBoundingClientRect().top === e.target.getBoundingClientRect().top &&
						verse.dataset.verse
					) {
						positive(verse.dataset.verse);
						found = true;
						break;
					}
				}
				if (!found) {
					for (let i = 0; i < verses.length; i++) {
						const verse = verses[i];
						if (
							verse.getBoundingClientRect().top >= e.target.getBoundingClientRect().top &&
							verse.dataset.verse
						) {
							positive(verse.dataset.verse);
							break;
						}
					}
				}
				timer = null;
			}, 200);
		}
	};

	const scroll = async (/** @type {String} */ target) => {
		programmaticScroll = true;
		//wait for promises in pages to resolve before scrolling
		await Promise.all(
			pages.map((/** @type {{ tpData: any; }} */ page) => {
				return page.tpData;
			})
		);
		const verse = scrollContainer?.querySelector(`[data-verse="${target}"]`);
		if (!verse && scrollContainer) {
			//check whether the verse should be there
			// goto(
			// 	`${base}/textzeugen/${$page.params.sigla}/${target.replace('.', '/')}?${$page.url.searchParams.toString()}`
			// );
			console.log('Verse not found.', target, scrollContainer);
			return;
		}
		if (!scrollContainer) {
			return;
		}
		// verse.scrollIntoView({ behavior: 'instant', block: 'start' });
		scrollContainer?.scrollTo({
			top:
				scrollContainer?.scrollTop +
				Number(verse.parentElement?.getBoundingClientRect().top) -
				scrollContainer?.getBoundingClientRect().top,
			behavior: 'instant'
		});
		verse.parentElement?.classList.add('animate-pulse', 'once');
		// check whether the verse is on the last page in the scrollcontainer
		if (scrollContainer.scrollHeight - scrollContainer.clientHeight === scrollContainer.scrollTop) {
			const dataset = verse.parentElement?.dataset;
			if (dataset) {
				localPageChange(dataset);
			}
		}
	};
	$effect(() => {
		//this effect rerons more often than it should, sometimes the value of targetverse didn't even change this is why we need to keep track of the target ourselves
		if (localTarget !== targetverse) {
			localTarget = targetverse;
			scroll(targetverse);
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
	// returns true when the column is empty or when it contains only children that are empty or themselves have empty children (recursively)
	const isEmptyColumn = (/** @type {String} */ column) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(column, 'text/html');
		const children = doc.body.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.children.length === 0) {
				if (child.textContent?.trim() !== '') {
					return false;
				}
			} else {
				if (!isEmptyColumn(child.innerHTML)) {
					return false;
				}
			}
		}
		return true;
	};
</script>

<div class="max-h-[70vh] overflow-y-auto" onscrollend={onScrollEnd} bind:this={scrollContainer}>
	{#if pages}
		{#each pages as pageObject (pageObject.id)}
			{#await pageObject.tpData}
				Lade Seite...
			{:then tpData}
				<div
					class="page tei-content"
					data-id={pageObject.id}
					data-next={tpData?.nextId}
					data-previous={tpData?.previousId}
					use:addToObserver
				>
					{#await pageObject.iiif then iiif}
						{#if iiif?.id}
							<button
								onclick={() => {
									localIiifChange(iiif);
								}}
								class="ml-2 float-right"
							>
								<img
									src="{iiif.id}/full/!250,120/0/default.jpg"
									alt="thumbnail der Seite {pageObject.id}"
								/>
							</button>
						{:else}
							<button
								onclick={() => {
									localIiifChange(iiif);
								}}
								class="btn preset-filled ml-2 float-right"
							>
								Seite wechseln
							</button>
						{/if}
					{/await}
					{@html tpData?.content}
				</div>
				<hr class="!border-t-4 !border-primary-500" />
			{:catch error}
				{error.message}
			{/await}
		{/each}
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.page {
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
