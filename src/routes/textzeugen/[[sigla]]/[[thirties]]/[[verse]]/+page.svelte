<script>
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import { teipb } from '$lib/constants';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {import('openseadragon') | undefined}
	 */
	let OpenSeadragon;

	/**
	 * @type {import('openseadragon').Viewer[]}
	 */
	let viewer = [];

	let tpData = [];

	onMount(async () => {
		OpenSeadragon = (await import('openseadragon')).default;
		data.sigla?.forEach((witnes) => {
			viewer = [
				...viewer,
				new OpenSeadragon.Viewer({
					id: `viewer-${witnes}`,
					prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
					navImages: {
						zoomIn: {
							REST: 'zoomin_rest.svg',
							GROUP: 'zoomin_grouphover.svg',
							HOVER: 'zoomin_hover.svg',
							DOWN: 'zoomin_pressed.svg'
						},
						next: {
							REST: 'next_rest.svg',
							GROUP: 'next_grouphover.svg',

							HOVER: 'next_hover.svg',
							DOWN: 'next_pressed.svg'
						},
						previous: {
							REST: 'previous_rest.svg',
							GROUP: 'previous_grouphover.svg',
							HOVER: 'previous_hover.svg',
							DOWN: 'previous_pressed.svg'
						},
						fullpage: {
							REST: 'fullpage_rest.svg',
							GROUP: 'fullpage_grouphover.svg',
							HOVER: 'fullpage_hover.svg',
							DOWN: 'fullpage_pressed.svg'
						},
						home: {
							REST: 'home_rest.svg',
							GROUP: 'home_grouphover.svg',
							HOVER: 'home_hover.svg',
							DOWN: 'home_pressed.svg'
						},
						zoomOut: {
							REST: 'zoomout_rest.svg',
							GROUP: 'zoomout_grouphover.svg',
							HOVER: 'zoomout_hover.svg',
							DOWN: 'zoomout_pressed.svg'
						},
						rotateleft: {
							REST: 'rotateleft_rest.svg',
							GROUP: 'rotateleft_grouphover.svg',
							HOVER: 'rotateleft_hover.svg',
							DOWN: 'rotateleft_pressed.svg'
						},
						rotateright: {
							REST: 'rotateright_rest.svg',
							GROUP: 'rotateright_grouphover.svg',
							HOVER: 'rotateright_hover.svg',
							DOWN: 'rotateright_pressed.svg'
						},
						flip: {
							REST: 'flip_rest.svg',
							GROUP: 'flip_grouphover.svg',
							HOVER: 'flip_hover.svg',
							DOWN: 'flip_pressed.svg'
						}
					},
					sequenceMode: false
				})
			];
		});
	});

	$: {
		if (viewer[0] && data.iiif[0]) {
			console.log('loading iiif');
			data.iiif.forEach((iiif, index) => {
				if (iiif === 'not found') return;
				fetch(iiif)
					.then((res) => res.json())
					.then((json) => {
						viewer[index].open(json);
					});
			});
		}
	}
	$: if (viewer[0])
		data.sigla?.forEach(async (element, i) => {
			console.log('running for ', element);
			if (data.page[i] === 'not found') return;
			tpData[element] = fetch(
				`${teipb}/parts/${element}.xml/json?&view=page&id=${data.page[i]}&odd=parzival.odd`
			).then((r) => r.json());
			tpData = { ...tpData };
		});
</script>

<section class="w-full">
	<h1 class="h1">Textzeugen</h1>
	<p>Textzeugenansicht, Einstellungen</p>
</section>
{#if data.sigla}
	{#each data.sigla as witnes}
		<section class="grid grid-cols-2">
			<section>
				{#await tpData[witnes]}
					<p>Loading...</p>
				{:then tpData}
					{#if tpData}
						{#if tpData?.content}
							<!-- find <cb> and divide the content into two divs-->
							{@const columns = tpData.content.split('<br class="tei-cb">')}
							<div class="flex flex-row gap-5">
								{#each columns as column}
									<div class="column">{@html column}</div>
								{/each}
							</div>
						{:else}
							{JSON.stringify(tpData)}
						{/if}
					{:else}
						<p>Der Vers existiert nicht</p>
					{/if}
				{:catch error}
					<p style="color: red">{error.message}</p>
				{/await}
			</section>
			<section>
				<div id="viewer-{witnes}" class="w-full h-[60vh]"></div>
			</section>
		</section>
	{/each}
{:else}
	<p>Keine Textzeugen ausgewählt</p>
{/if}

<style>
	.column :global(.line) {
		display: flex;
		gap: 1em;
		margin: 0.5em 0;
	}
</style>