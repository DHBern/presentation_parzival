<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';
	import TextzeugenContent from './TextzeugenContent.svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { goto, replaceState } from '$app/navigation';
	import { URL_STATIC_API, URL_IIIF } from '$lib/constants';
	import filenameFromHandleAndId from '$lib/functions/filenameFromHandleAndId';
	import Popover from '$lib/components/Popover.svelte';
	import sigilFromHandle from '$lib/functions/sigilFromHandle';
	import metadataFromHandle from '$lib/functions/metadataFromHandle';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let synchro = $state(true);

	let selectedSigla = $derived(data.content ? data.content.map((c) => c.sigla) : []);

	const generateCloseLink = (/** @type {String} */ sigla) => {
		const siglas = selectedSigla.filter((e) => e !== sigla);
		let path = `${base}/textzeugen/${siglas.join('-')}`;
		if (siglas.length) {
			if (data.thirties) {
				path += `/${data.thirties}`;
				if (data.verse) {
					path += `/${data.verse}`;
				}
			}
		}
		return path;
	};

	const generateIiifLink = (
		/** @type {URL} */ url,
		/** @type {Number} */ i,
		/** @type {boolean} */ open
	) => {
		let link = new URL(url.toString());
		const currentParam = url.searchParams.get('iiif')?.split('-') ?? [];
		currentParam[i] = String(open);
		if (open) {
			if (currentParam.some((e) => e === 'false')) {
				link.searchParams.set('iiif', currentParam.join('-'));
			} else {
				link.searchParams.delete('iiif');
			}
		} else {
			link.searchParams.set('iiif', currentParam.join('-'));
		}
		return link.toString();
	};
	let localVerses = $state(
		Array(data.content?.length).fill(`${data.thirties}.${data.verse ? data.verse : '01'}`)
	);
	let targetverses = $state(
		Array(data.content?.length).fill(`${data.thirties}.${data.verse ? data.verse : '01'}`)
	);
	const generateLocalPagesFromData = (d) => {
		return d?.map((c) => {
			if (typeof c.meta === 'object') {
				return c.meta.then((meta) => {
					return meta;
				});
			}
			return [];
		});
	};

	let localPages = $state(generateLocalPagesFromData(data.content));
	const generateIiifFromData = (d) => {
		return d?.map(async (c) => {
			if (typeof c.meta === 'object') {
				let meta = await c.meta;
				let active = meta.find((m) => m.active);
				return { manifest: active?.iiif, overlay: active?.overlay };
			}
		});
	};
	let currentIiif = $state(generateIiifFromData(data.content));
	$effect(() => {
		localVerses = Array(data.content?.length).fill(
			`${data.thirties}.${data.verse ? data.verse : '01'}`
		);
		targetverses = Array(data.content?.length).fill(
			`${data.thirties}.${data.verse ? data.verse : '01'}`
		);
		localPages = generateLocalPagesFromData(data.content);
		currentIiif = generateIiifFromData(data.content);
	});

	const checklocalPages = async (
		/** @type {{id:string, previous:string, next:string}} */ pageInfo,
		/** @type {number} */ i,
		/** @type {string} */ sigla
	) => {
		const indexCurrent = (await localPages[i]).findIndex(
			(/** @type {{ id: string; }} */ p) => p.id === pageInfo.id
		);
		const pageArray = await localPages[i];
		// Don't switch the iiif viewer on page change, just on click
		//pageArray[indexCurrent]?.iiif.then((/** @type {any} */ iiif) => {
		// 	currentIiif[i] = iiif;
		// });
		const createObject = (/** @type {string} */ id) => {
			return {
				id: id,
				tpData: fetch(`${base}/textzeugen/data/${sigla}/${id}`).then((r) => r.json()),
				// using id.toUpperCase() to match the iiif file naming convention - this might change in the future
				iiif: fetch(`${URL_IIIF}/${id}.jpf/info.json`).then((r) => r.json()),
				overlay: `${URL_STATIC_API}/svg/${filenameFromHandleAndId(sigla, id)}.svg`
			};
		};

		//switch statement for the cases -1, 0,pageArray.length
		switch (indexCurrent) {
			case -1:
				console.error('current page not found in localPages', pageInfo);
				break;
			case 0:
				if (pageInfo.previous) {
					localPages[i] = [createObject(pageInfo.previous), ...pageArray];
				}
				break;
			case pageArray.length - 1:
				if (pageInfo.next) {
					localPages[i] = [...pageArray, createObject(pageInfo.next)];
				}
				break;
		}
		return true;
	};
</script>

<section class="w-full">
	<h1 class="h1 my-4">Transkriptionen</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<div class="flex flex-col gap-6">
			{#if data.content?.length > 1}
				<div>
					<Switch
						thumbInactive="bg-surface-800"
						controlInactive="bg-surface-100"
						name="synchro"
						checked={synchro}
						onCheckedChange={(e) => (synchro = e.checked)}
					>
						synchron scrollen
					</Switch>
				</div>
			{/if}
		</div>
		<TextzeugenSelector
			sigla={[...data.codices, ...data.fragments]}
			{selectedSigla}
			coordinates={[data.thirties, data.verse]}
		/>
	</div>
</section>
{#if data.content}
	<div class="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-4">
		{#each data.content as info, i (info.sigla)}
			<article
				class="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-4 preset-filled-surface-500 my-4 py-4 px-8 rounded-xl"
			>
				<section>
					<div class="mb-4 relative">
						<h2 class="h2">
							Textzeuge:
							<Popover>
								{#snippet trigger()}
									{sigilFromHandle(info.sigla)}
								{/snippet}
								{#snippet content()}
									{@html metadataFromHandle(info.sigla)['info-h2']}
									(<a
										class="anchor text-primary-100"
										href="{base}/hsverz#{sigilFromHandle(info.sigla)}"
										>zum Verzeichnis
									</a>)
								{/snippet}
							</Popover>
						</h2>
						{#if localVerses[i]}
							<p>
								Vers: {localVerses[i].slice(0, -2)}{Number(localVerses[i].slice(-2))}
							</p>
						{/if}
						<div class="absolute top-0 right-0">
							{#if !(page.url.searchParams.get('iiif')?.split('-')[i] === 'false')}
								<a
									class="btn btn-icon"
									href={generateIiifLink(page.url, i, false)}
									aria-label="Faksimile verstecken"
								>
									<i class="fa-solid fa-eye-slash"></i>
								</a>
							{:else}
								<a
									class="btn btn-icon"
									href={generateIiifLink(page.url, i, true)}
									aria-label="Faksimile anzeigen"
								>
									<i class="fa-solid fa-eye"></i>
								</a>
							{/if}
							<a
								class="btn btn-icon"
								href={generateCloseLink(info.sigla)}
								aria-label="Ansicht schließen"
							>
								<i class="fa-solid fa-x"></i>
							</a>
						</div>
					</div>
					{#await localPages[i]}
						Lade Text...
					{:then pages}
						{#if pages?.length && pages[0].id}
							<TextzeugenContent
								{pages}
								targetverse={targetverses[i]}
								localVerseChange={(verse) => {
									localVerses[i] = verse;
									if (synchro) {
										const indexOfOther = localVerses.findIndex((v) => v != verse);
										if (indexOfOther != -1) {
											localVerses[indexOfOther] = verse;
											targetverses[indexOfOther] = verse;
										}
									}
									replaceState(
										`${base}/textzeugen/${page.params.sigla}/${verse.replace('.', '/')}?${page.url.searchParams.toString()}`,
										{}
									);
								}}
								localPageChange={(
									/** @type {{ id: string; previous: string; next: string; }} */ pageinfo
								) => {
									checklocalPages(pageinfo, i, info.sigla);
								}}
								localIiifChange={(/** @type {Object} */ e) => (currentIiif[i] = e)}
								range={data.ranges.find((r) => r.label === info.sigla).values}
								label={info.sigla}
							/>
						{:else}
							<p class="text-error-500">
								Keine Daten zum Vers gefunden. Möglicherweise existiert der Vers nicht? <button
									onclick={() => {
										goto(
											`${base}/textzeugen/${page.params.sigla}/${localVerses[i].replace('.', '/')}?${page.url.searchParams.toString()}`
										);
									}}
									class="btn">aktualisieren</button
								>
							</p>
						{/if}
					{/await}
				</section>
				{#if !(page.url.searchParams.get('iiif')?.split('-')[i] === 'false')}
					<section class="min-h-[40vh]">
						{#await currentIiif[i] then current}
							{#if typeof current === 'object' && Object.keys(current).length}
								<IIIFViewer iiif={current} />
							{/if}
						{/await}
					</section>
				{/if}
			</article>
		{/each}
	</div>
{/if}
