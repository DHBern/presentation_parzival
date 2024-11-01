<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';
	import TextzeugenContent from './TextzeugenContent.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { iiif } from '$lib/constants';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let selectedSigla = $derived(data.content ? data.content.map((c) => c.sigla) : []);

	const generateLabel = (/** @type {String[]} */ sigla) => {
		const info = [...data.codices, ...data.fragments];
		sigla = sigla.map((s) => {
			const found = info.find((i) => i.handle === s);
			if (found) {
				const { sigil, loc, cod } = found;
				const location = loc ? `Standort: ${loc}` : '';
				const codex = cod ? `Codex: ${cod}` : '';
				return `<abbr title='${[location, codex].join(', ')}'>${sigil}</abbr>`;
			}
			return s;
		});
		return sigla.join(' und ');
	};

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
	let localVerses = $state(Array(data.content?.length).fill(`${data.thirties}.${data.verse}`));
	let targetverses = $state(Array(data.content?.length).fill(`${data.thirties}.${data.verse}`));
	$inspect(targetverses);
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
				return await active.iiif;
			}
		});
	};
	let currentIiif = $state(generateIiifFromData(data.content));
	$effect(() => {
		localVerses = Array(data.content?.length).fill(`${data.thirties}.${data.verse}`);
		targetverses = Array(data.content?.length).fill(`${data.thirties}.${data.verse}`);
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
		// Don't switch the iiif viewer on page change, just on click
		// localPages[i][indexCurrent]?.iiif.then((/** @type {any} */ iiif) => {
		// 	currentIiif[i] = iiif;
		// });
		const createObject = (/** @type {string} */ id) => {
			return {
				id: id,
				tpData: fetch(`${base}/textzeugen/data/${sigla}/${id}`).then((r) => r.json()),
				iiif: fetch(`${iiif}/${id}.jpf/info.json`).then((r) => r.json())
			};
		};

		//switch statement for the cases -1, 0, localPages[i].length
		switch (indexCurrent) {
			case -1:
				console.error('current page not found in localPages', pageInfo.id);
				break;
			case 0:
				if (pageInfo.previous) {
					localPages[i] = [createObject(pageInfo.previous), ...(await localPages[i])];
				}
				break;
			case localPages[i].length - 1:
				if (pageInfo.next) {
					localPages[i] = [...(await localPages[i]), createObject(pageInfo.next)];
				}
				break;
		}
	};
</script>

<section class="w-full">
	<h1 class="h1 my-4">Textzeugen</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>
			Dies ist die Textzeugenansicht. Derzeit {Number(data.content?.length) > 1 ? 'werden' : 'wird'}
			{@html data?.content ? generateLabel(selectedSigla) : 'keine Textzeugen'} angezeigt. Mit dem Selektor
			können Sie die Textzeugen wechseln.
		</p>
		<TextzeugenSelector
			sigla={[...data.codices, ...data.fragments]}
			{selectedSigla}
			coordinates={[data.thirties, data.verse]}
		/>
	</div>
</section>
{#if data.content}
	<div class="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-4">
		{#each data.content as content, i}
			<article
				class="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-4 bg-surface-active-token my-4 py-4 px-8 rounded-xl"
			>
				<section>
					<div class="mb-4 relative">
						<h2 class="h2">Textzeuge: {@html generateLabel([content.sigla])}</h2>
						<p>
							Vers: {localVerses[i]}
						</p>
						<div class="absolute top-0 right-0">
							{#if !($page.url.searchParams.get('iiif')?.split('-')[i] === 'false')}
								<a
									class="btn btn-icon"
									href={generateIiifLink($page.url, i, false)}
									aria-label="Faksimile verstecken"
								>
									<i class="fa-solid fa-eye-slash"></i>
								</a>
							{:else}
								<a
									class="btn btn-icon"
									href={generateIiifLink($page.url, i, true)}
									aria-label="Faksimile anzeigen"
								>
									<i class="fa-solid fa-eye"></i>
								</a>
							{/if}
							<a
								class="btn btn-icon"
								href={generateCloseLink(content.sigla)}
								aria-label="Ansicht schliessen"
							>
								<i class="fa-solid fa-x"></i>
							</a>
						</div>
					</div>
					{#await localPages[i]}
						Lade Text...
					{:then pages}
						<TextzeugenContent
							{pages}
							targetverse={targetverses[i]}
							localVerseChange={(verse) => {
								console.log('localVerseChange', verse);
								localVerses[i] = verse;
								const indexOfOther = localVerses.findIndex((v) => v != verse);
								if (indexOfOther != -1) {
									localVerses[indexOfOther] = verse;
									targetverses[indexOfOther] = verse;
								}
								replaceState(
									`${base}/textzeugen/${$page.params.sigla}/${verse.replace('.', '/')}?${$page.url.searchParams.toString()}`,
									{}
								);
							}}
							localPageChange={(
								/** @type {{ id: string; previous: string; next: string; }} */ pageinfo
							) => checklocalPages(pageinfo, i, content.sigla)}
							localIiifChange={(/** @type {Object} */ e) => (currentIiif[i] = e)}
						/>
					{/await}
				</section>
				{#if !($page.url.searchParams.get('iiif')?.split('-')[i] === 'false')}
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
