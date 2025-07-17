<script>
	import * as d3 from 'd3';
	import { computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { base } from '$app/paths';
	import { fragmentLabel, summaryLabel } from '$lib/constants';
	import {
		DATA_MIN,
		DATA_MAX,
		SCROLL_SPEED,
		ZOOM_INCREMENT,
		ZOOM_MINIMUM_WINDOW_SIZE
	} from './Devilstable_DEFAULTS.json';

	import siglaFromHandle from '$lib/functions/siglaFromHandle';
	import metadataFromHandle from '$lib/functions/metadataFromHandle';

	/** @type {{codices: any, width?: number, height?: number,data?: {values: boolean[], label: string}[],  selection: {start: number, end: number}, roundToStep: function}} */
	let {
		codices,
		width = 400,
		height = 400,
		data = [],
		selection = $bindable(),
		roundToStep
	} = $props();
	let marginTop = 30;
	let marginRight = 0;
	let marginBottom = 20;
	let marginLeft = 35;

	/**
	 * @type {SVGGElement}
	 */
	let gx = $state();
	/**
	 * @type {SVGGElement}
	 */
	let gy = $state();
	/**
	 * @type {number[]}
	 */
	let mousePos = $state([0, 1]);

	/**
	 * @type {HTMLElement}
	 */
	let floating = $state();
	/**
	 * @type {HTMLElement}
	 */
	let hoverLine = $state();

	/**
	 * @type {SVGElement}
	 */
	let svgElement = $state();

	const handleWheel = (/** @type {{ deltaY: any; }} */ event) => {
		event.preventDefault();

		// Check if the CTRL key is held down during the scroll
		const isZooming = event.ctrlKey;

		let delta = selection.end - selection.start;

		if (isZooming) {
			// Zoom in
			if (event.deltaY > 0) {
				// Zoom out
				selection.start = roundToStep(Math.max(DATA_MIN, selection.start - ZOOM_INCREMENT));
				selection.end = roundToStep(Math.min(DATA_MAX, selection.end + ZOOM_INCREMENT));
			} else {
				// Zoom in
				if (delta > ZOOM_MINIMUM_WINDOW_SIZE) {
					selection.start = roundToStep(Math.max(DATA_MIN, selection.start + ZOOM_INCREMENT));
					selection.end = roundToStep(
						Math.max(
							selection.start + ZOOM_MINIMUM_WINDOW_SIZE,
							Math.min(DATA_MAX, selection.end - ZOOM_INCREMENT)
						)
					);
				}
			}
		} else {
			// Scroll
			if (event.deltaY > 0) {
				// Scroll down
				selection.end = roundToStep(Math.min(DATA_MAX, selection.end + SCROLL_SPEED));
				selection.start = roundToStep(selection.end - delta);
			} else {
				// Scroll up
				selection.start = roundToStep(Math.max(DATA_MIN, selection.start - SCROLL_SPEED));
				selection.end = roundToStep(selection.start + delta);
			}
		}
	};

	const handleMouseMove = (/** @type {{ clientX: any; clientY: any; }} */ event) => {
		mousePos = d3.pointer(event, svgElement);
		if (mousePos[0] >= marginLeft && mousePos[1] >= marginTop) {
			// show horizontal line
			hoverLine.style.opacity = '1';
			hoverLine.setAttribute('y1', `${mousePos[1]}`);
			hoverLine.setAttribute('y2', `${mousePos[1]}`);

			// show floating element
			const virtualEl = {
				getBoundingClientRect() {
					return {
						width: 0,
						height: 0,
						x: event.clientX,
						y: event.clientY,
						left: event.clientX,
						right: event.clientX,
						top: event.clientY,
						bottom: event.clientY
					};
				}
			};

			computePosition(virtualEl, floating, {
				placement: 'right-start',
				middleware: [offset(15), flip(), shift()],
				strategy: 'fixed'
			}).then(({ x, y }) => {
				Object.assign(floating.style, {
					left: `${x}px`,
					top: `${y}px`,
					opacity: '1',
					display: 'block'
				});
			});
		} else {
			// hide floating element
			floating.style.display = 'none';
			floating.style.opacity = '0';
			// hide horizontal line
			hoverLine.style.opacity = '0';
		}
	};

	/**
	 * @param { import('d3').ScaleBand<string> } scale
	 */
	function scaleBandInvert(scale) {
		const domain = scale.domain();
		const paddingOuter = scale(domain[0]) ?? 0;
		const eachBand = scale.step();
		return function (/** @type {number} */ value) {
			const index = Math.floor((value - paddingOuter) / eachBand);
			return domain[Math.max(0, Math.min(index, domain.length - 1))];
		};
	}

	const popupFragments = $state({});
	const popupLabels = $state({});
	const openPopupFragments = (e, verseNumber) => {
		e.preventDefault();
		e.stopPropagation();
		const reference = e.currentTarget;
		const popup = popupFragments[verseNumber];
		popup.style.display = 'block';
		if (popup && reference) {
			computePosition(reference, popup, {
				placement: 'top'
			}).then(({ x, y }) => {
				Object.assign(popup.style, {
					top: `${y}px`,
					left: `${x}px`,
					opacity: '1'
				});
			});
		}
	};
	let contigousData = $derived(
		data.map((d) => {
			// skip for label 'fr'
			if (d.label === 'fr') return d;

			// init
			let contiguousRanges = [];
			let start = null;

			//
			for (let i = 0; i < d.values.length; i++) {
				if (d.values[i] && start === null) {
					// start a new range
					start = i + selection.start;
				} else if (!d.values[i] && start !== null) {
					contiguousRanges.push([start, i + selection.start - 1]);
					start = null; // reset start
				}
			}
			// if range is still open at the end
			if (start !== null) {
				contiguousRanges.push([start, d.values.length + selection.start - 1]);
			}
			return {
				label: d.label,
				values: contiguousRanges
			};
		})
	);
	let x = $derived(
		d3
			.scaleBand(
				data.map((d) => d.label),
				[marginLeft, width - marginRight]
			)
			.round(true)
			.paddingOuter(0.1)
			.paddingInner(0.2)
	);
	let y = $derived(
		d3.scaleLinear(
			// Domain: from bottom to top: at the bottom is the last selected verse, at the top is the first selected verse
			[selection.start + data[0]?.values.length, selection.start],
			[height - marginBottom, marginTop]
		)
	);
	let verse = $derived(Math.floor(y.invert(mousePos[1])));
	let frValues = $derived(data.find((d) => d.label === 'fr')?.values);
	let manuscriptHandles = $derived(
		scaleBandInvert(x)(mousePos[0]) === 'fr'
			? frValues?.[verse - selection.start] || 'fr'
			: scaleBandInvert(x)(mousePos[0])
	);
	$effect(() => {
		d3.select(gy)
			.call(
				d3
					.axisRight(y)
					.ticks(20)
					.tickSize(width - marginLeft - marginRight)
			)
			.call(
				(/** @type import('d3-selection').Selection<SVGGElement, any, null, undefined> */ g) => {
					g.selectAll('.tick text').attr('x', -25);
				}
			);
	});
	$effect(() => {
		d3.select(gx)
			.call(
				d3
					.axisTop(
						d3
							.scaleBand(
								data.map((d) => codices.find((i) => i.handle === d.label)?.sigil || d.label),
								[marginLeft, width - marginRight]
							)
							.round(true)
							.paddingOuter(0.1)
							.paddingInner(0.2)
					)
					.tickFormat((d) => (d === 'fr' ? fragmentLabel : d))
			)
			.selectAll('.tick text')
			.call((g) => {
				g.attr('role', 'button');
				g.attr('tabindex', '0');
			})
			.on('click', (e) => {
				const reference = e.currentTarget;
				const popup =
					popupLabels[
						codices.find((i) => i.sigil === reference.textContent)?.handle || reference.textContent
					];
				if (popup && reference) {
					popup.style.display = 'block';
					computePosition(reference, popup, {
						placement: 'top'
					}).then(({ x, y }) => {
						Object.assign(popup.style, {
							top: `${y}px`,
							left: `${x}px`,
							opacity: '1'
						});
					});
				}
			})

			.on('blur', (e) => {
				const reference = e.currentTarget;
				const popup =
					popupLabels[
						codices.find((i) => i.sigil === reference.textContent)?.handle || reference.textContent
					];
				if (popup) {
					popup.style.display = 'none';
					popup.style.opacity = '0';
				}
			});
	});
</script>

<div
	class="card hidden opacity-0 p-1 preset-filled-primary-500 fixed top-0 left-0 w-max"
	data-popup="popupVerse"
	bind:this={floating}
>
	<!-- if manuscriptHandles is an array, we create a list of Links, if it if either Fassungen or fr, we just create a paragraph that informs about the verse.-->
	{#if Array.isArray(manuscriptHandles)}
		<ul>
			{#each manuscriptHandles as mHandle}
				<li>
					<!-- These links are not clickable since it's not possible to put the cursor over it, but it might be possible to access the links with ARIA means. -->
					<a href={`${base}/textzeugen/${mHandle}/${verse}`} class="hover:text-secondary-900">
						{@html siglaFromHandle(mHandle)}: {verse}
					</a>
				</li>
			{/each}
		</ul>
	{:else if manuscriptHandles === summaryLabel}
		<p>Dreißiger {verse}</p>
	{:else if manuscriptHandles === 'fr'}
		<p>Fragment {verse}</p>
	{:else}
		<p>{@html siglaFromHandle(String(manuscriptHandles))}: {verse}</p>
	{/if}
</div>
<!-- clickable popups on column labels -->
{#each data.map((d) => d.label) as handle}
	{@const metadata = metadataFromHandle(handle)}
	<div
		class="card p-1 preset-filled-primary-500 absolute hidden opacity-0 top-0 left-0 max-w-prose prose"
		bind:this={popupLabels[handle]}
	>
		<strong class="">{@html metadata?.['info-h1']}</strong>
		{@html metadata?.['info-h2']}
		{@html metadata?.info}
	</div>
{/each}
<!-- popups for fragments -->
{#each frValues || [] as fragment, i}
	{#if Array.isArray(fragment)}
		{@const verse = i + selection.start}
		<div
			class="card p-1 preset-filled-primary-500 top-0 left-0 w-max absolute opacity-0 hidden"
			bind:this={popupFragments[verse]}
		>
			<ul>
				{#each fragment as handle}
					<li>
						<a href={`${base}/textzeugen/${handle}/${verse}`} class="hover:text-secondary-900">
							{@html siglaFromHandle(handle)}
							{verse}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/each}
<div
	onwheel={handleWheel}
	onmousemove={handleMouseMove}
	onmouseleave={(_e) => {
		floating.style.display = 'none';
		floating.style.opacity = '0';
		hoverLine.style.opacity = '0';
	}}
	role="application"
	class="mt-6"
>
	<svg {width} {height} bind:this={svgElement} shape-rendering="crispEdges">
		<g bind:this={gx} transform="translate(0,{marginTop})" class="x-axis" />
		<g bind:this={gy} transform="translate({marginLeft},0)" class="y-axis" />

		{#each contigousData as sigla}
			<g data-manuscript={sigla.label}>
				{#each sigla.values as values, i}
					{#if values}
						{#if isNaN(values[1])}
							{@const verseNumber = i + selection.start}
							{#if values?.lenth === 1}
								<a
									href={`${base}/textzeugen/${values[0]}/${verseNumber}`}
									aria-label={`${values[0]}.${verseNumber}`}
								>
									<rect
										x={x(sigla.label)}
										y={y(verseNumber)}
										width={x.bandwidth()}
										height={y(verseNumber) - y(verseNumber - 1)}
										fill="currentColor"
										class="hover:text-primary-500"
									/>
								</a>
							{:else}
								<!-- svelte-ignore a11y_invalid_attribute -->
								<a
									role="button"
									tabindex="0"
									href="#"
									onkeydown={(e) => openPopupFragments(e, verseNumber)}
									onclick={(e) => {
										openPopupFragments(e, verseNumber);
									}}
									aria-label={`Mehrere Fr in Vers ${verseNumber}`}
									onblur={() => {
										popupFragments[verseNumber].style.display = 'none';
										popupFragments[verseNumber].style.opacity = '0';
									}}
								>
									<rect
										x={x(sigla.label)}
										y={y(verseNumber)}
										width={x.bandwidth()}
										height={y(verseNumber) - y(verseNumber - 1)}
										fill="currentColor"
										class="hover:text-primary-500"
									/>
								</a>
							{/if}
						{:else if sigla.label === summaryLabel}
							<a href={`${base}/fassungen/${verse}`} aria-label={`Fassung ${verse}`}>
								<rect
									x={x(sigla.label)}
									y={y(values[0])}
									width={x.bandwidth()}
									height={y(values[1] + 1) - y(values[0])}
									fill="currentColor"
									class="hover:text-primary-500"
								/>
							</a>
						{:else}
							<a
								href={`${base}/textzeugen/${sigla.label}/${verse}`}
								aria-label={`${sigla.label}.${verse}`}
							>
								<rect
									x={x(sigla.label)}
									y={y(values[0])}
									width={x.bandwidth()}
									height={y(values[1] + 1) - y(values[0])}
									fill="currentColor"
									class="hover:text-primary-500"
								/>
							</a>
						{/if}
					{/if}
				{/each}
			</g>
		{/each}
		<line
			bind:this={hoverLine}
			opacity="0"
			x1="0"
			x2={width}
			stroke-width="1"
			pointer-events="none"
			stroke="currentColor"
			class="text-primary-500"
		/>
	</svg>
</div>

<style>
	.x-axis :global(text) {
		font-size: 1rem;
	}

	.y-axis :global(.tick line) {
		stroke-opacity: 0.5;
		stroke-dasharray: 2, 2;
	}
</style>
