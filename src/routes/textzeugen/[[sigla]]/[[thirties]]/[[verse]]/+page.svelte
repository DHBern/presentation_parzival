<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';
	import TextzeugenContent, { setTarget } from './TextzeugenContent.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { iiif } from '$lib/constants';

	/** @type {import('./$types').PageData} */
	export let data;

	$: selectedSigla = data.content ? data.content.map((c) => c.sigla) : [];

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

	setTarget(`${data.thirties}.${data.verse}`);
	let localVerses = Array(data.content?.length).fill(`${data.thirties}.${data.verse}`);
	let localPages = Array(data.content?.length).fill([]);
	let currentIiif = Array(data.content?.length).fill({});

	afterNavigate(() => {
		console.log('navigated');
		//fill the data from the load-function into the localPages array
		data.content?.forEach((c, i) => {
			if (typeof c.meta === 'object') {
				c.meta.then((meta) => {
					localPages[i] = [...meta];
					meta
						// @ts-ignore
						.find((m) => m.active)
						// @ts-ignore
						?.iiif.then((iiif) => {
							console.log('setting iiif', iiif);
							currentIiif[i] = iiif;
						});
				});
			}
		});
	});

	const checklocalPages = (
		/** @type {CustomEvent<any>} */ e,
		/** @type {number} */ i,
		/** @type {string} */ sigla
	) => {
		const indexCurrent = localPages[i].findIndex(
			(/** @type {{ id: string; }} */ p) => p.id === e.detail.id
		);
		// Don't switch the iiif viewer on page change, just on click
		// localPages[i][indexCurrent]?.iiif.then((/** @type {any} */ iiif) => {
		// 	currentIiif[i] = iiif;
		// });
		const createObject = (/** @type {string} */ id) => {
			return {
				id: id,
				tpData: fetch(`/textzeugen/data/${sigla}/${id}`).then((r) => r.json()),
				iiif: fetch(`${iiif}/${id}.jpf/info.json`).then((r) => r.json())
			};
		};

		//switch statement for the cases -1, 0, localPages[i].length
		switch (indexCurrent) {
			case -1:
				console.error('current page not found in localPages', e.detail.id);
				break;
			case 0:
				if (e.detail.previous) {
					console.log('fetching previous', e.detail.previous);
					localPages[i] = [createObject(e.detail.previous), ...localPages[i]];
				}
				break;
			case localPages[i].length - 1:
				if (e.detail.next) {
					console.log('fetching next', e.detail.next);
					localPages[i] = [...localPages[i], createObject(e.detail.next)];
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
								<a class="btn btn-icon" href={generateIiifLink($page.url, i, false)}>
									<i class="fa-solid fa-eye-slash"></i>
								</a>
							{:else}
								<a class="btn btn-icon" href={generateIiifLink($page.url, i, true)}>
									<i class="fa-solid fa-eye"></i>
								</a>
							{/if}
							<a class="btn btn-icon" href={generateCloseLink(content.sigla)}>
								<i class="fa-solid fa-x"></i>
							</a>
						</div>
					</div>
					<TextzeugenContent
						pages={localPages[i]}
						on:localVerseChange={(e) => {
							localVerses[i] = e.detail;
							replaceState(
								`${base}/textzeugen/${$page.params.sigla}/${e.detail.replace('.', '/')}?${$page.url.searchParams.toString()}`,
								{}
							);
						}}
						on:localPageChange={(e) => checklocalPages(e, i, content.sigla)}
					/>
				</section>
				{#if !($page.url.searchParams.get('iiif')?.split('-')[i] === 'false')}
					<section class="min-h-[40vh]">
						{#if typeof currentIiif[i] === 'object' && Object.keys(currentIiif[i]).length}
							<IIIFViewer iiif={currentIiif[i]} />
						{/if}
					</section>
				{/if}
			</article>
		{/each}
	</div>
{/if}
