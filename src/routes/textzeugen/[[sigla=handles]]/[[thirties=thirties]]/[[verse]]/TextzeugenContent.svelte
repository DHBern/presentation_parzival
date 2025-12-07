<script>
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import { onMount } from 'svelte';
	import { toaster } from '$lib/components/toaster';
	import sigilFromHandle from '$lib/functions/sigilFromHandle';

	let { pages, localPageChange, localIiifChange, localVerseChange, targetverse, range, label } =
		$props();
	/**
	 * @type {number | undefined}
	 */
	let localTarget;
	/**
	 * @type {number | undefined}
	 */
	let timer = $state(undefined);

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
						if (programmaticScroll) {
							return;
						}
						if (entry.target instanceof HTMLElement) {
							localPageChange(entry.target.dataset);
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
				timer = undefined;
			}, 200);
		}
	};

	const scroll = async (/** @type {String} */ target) => {
		if (!scrollContainer || !pages) {
			return;
		}
		programmaticScroll = true;
		//wait for promises in pages to resolve before scrolling
		await Promise.all(
			pages.map((/** @type {{ tpData: any; }} */ page) => {
				return page.tpData;
			})
		);
		let verse = scrollContainer?.querySelector(`[data-verse="${target}"]`);
		if (!verse && scrollContainer) {
			//check whether the verse should be there
			// goto(
			// 	`${base}/textzeugen/${$page.params.sigla}/${target.replace('.', '/')}?${$page.url.searchParams.toString()}`
			// );
			console.log('Verse not found.', target, scrollContainer);
			//find out whether the verse to scroll to is smaller than the first verse in the scrollContainer or larger than the last verse in the scrollContainer
			const verses = scrollContainer.querySelectorAll('.verse');
			const firstVerse = verses[0];
			const lastVerse = verses[verses.length - 1];
			if (firstVerse && lastVerse) {
				const loadFurther = async (
					/** @type {{ closest: (arg0: string) => { (): any; new (): any; dataset: any; }; }} */ el
				) => {
					console.log(
						`Target verse ${target} is not in the current scrollContainer range. Loading further pages...`
					);
					const dataset = el.closest('.page').dataset;
					if (dataset) {
						programmaticScroll = true;
						await localPageChange(dataset);
						await scroll(target);
					}
				};
				const firstThirtyNumber = Number(firstVerse.dataset.verse.split('.')[0]);
				const lastThirtyNumber = Number(lastVerse.dataset.verse.split('.')[0]);
				const targetThirtyNumber = Number(target.split('.')[0]);
				//check for targetThirtyNumber being in the set of available verses at all
				let inRange = false;
				range.forEach((/** @type {number[]} */ r) => {
					if (targetThirtyNumber >= r[0] && targetThirtyNumber <= r[1]) {
						inRange = true;
					}
				});
				if (inRange && targetThirtyNumber < firstThirtyNumber && targetThirtyNumber > 0) {
					await loadFurther(firstVerse);
				} else if (
					inRange &&
					targetThirtyNumber > lastThirtyNumber &&
					targetThirtyNumber < NUMBER_OF_PAGES
				) {
					await loadFurther(lastVerse);
					return;
				} else {
					toaster.error({
						title: 'Vers nicht überliefert',
						description: `Der Vers ${target} ist im Textzeugen ${sigilFromHandle(label)} nicht enthalten. Es werden die nächsten verfügbaren Verse angezeigt.`,
						duration: 60 * 5 * 1000
					});
					programmaticScroll = true;
					// find the verse that is closest to the target verse
					const closestVerse = Array.from(verses).reduce((closest, current) => {
						const currentThirtyNumber = Number(current.dataset.verse.split('.')[0]);
						if (
							Math.abs(currentThirtyNumber - targetThirtyNumber) <
							Math.abs(Number(closest.dataset.verse.split('.')[0]) - targetThirtyNumber)
						) {
							return current;
						}
						return closest;
					}, verses[0]);
					verse = closestVerse;
				}
			}
		}
		if (verse) {
			// verse.scrollIntoView({ behavior: 'instant', block: 'start' });
			scrollContainer?.scrollTo({
				top:
					scrollContainer?.scrollTop +
					Number(verse.parentElement?.getBoundingClientRect().top) -
					scrollContainer?.getBoundingClientRect().top,
				behavior: 'instant'
			});
			if (verse) {
				verse.parentElement?.classList.add('animate-pulse', 'once');
			}
			// check whether the verse is on the last page in the scrollcontainer
			if (
				scrollContainer.scrollHeight - scrollContainer.clientHeight ===
				scrollContainer.scrollTop
			) {
				const dataset = verse.closest('.page').dataset;
				if (dataset) {
					await localPageChange(dataset);
				}
			}
		}
	};
	$effect(() => {
		//this effect reruns more often than it should, sometimes the value of targetverse didn't even change this is why we need to keep track of the target ourselves
		if (localTarget !== targetverse) {
			localTarget = targetverse;
			scroll(targetverse);
		}
	});
	const modifyTpContent = (/** @type {string} */ content) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/html');
		const lines = Array.from(doc.querySelectorAll('.line:has(.tei-cb)'));
		lines.forEach((line) => {
			const cb = line.querySelector('.tei-cb');
			const beforeCb = line.cloneNode(true);
			//remove everthing after the tei-cb inside .content
			const contentBefore = beforeCb.querySelector('.content');
			if (contentBefore) {
				contentBefore.innerHTML = contentBefore.innerHTML.split(cb.outerHTML)[0];
			}
			const afterCb = line.cloneNode(true);
			afterCb.removeAttribute('id');
			const contentAfter = afterCb.querySelector('.content');
			if (contentAfter) {
				contentAfter.innerHTML = contentAfter.innerHTML.split(cb.outerHTML)[1];
			}
			if (!isEmptyColumn(beforeCb.querySelector('.content')?.innerHTML)) {
				line.insertAdjacentElement('beforebegin', beforeCb);
			}
			line.insertAdjacentElement('beforebegin', cb);
			line.insertAdjacentElement('beforebegin', afterCb);
			line.remove();
		});
		// return content;
		return doc.body.innerHTML;
	};
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
				{#if tpData}
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
										localIiifChange({ manifest: iiif, overlay: pageObject.overlay });
									}}
									class="ml-2 float-right sticky top-0"
								>
									<img
										src="{iiif.id}/full/90,/0/default.jpg"
										alt="thumbnail der Seite {pageObject.id}"
									/>
								</button>
							{/if}
						{/await}
						{@html modifyTpContent(tpData?.content)}
					</div>
					<hr class="!border-t-4 !border-primary-500" />
				{/if}
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
			@apply text-right pr-[95px] sticky top-0;
			:global(p) {
				@apply bg-surface-500;
			}
		}
		:global(.tei-cb:not(.tei-cb:first-child)) {
			@apply border-primary-300 border-solid border-t-4;
		}
	}
</style>
