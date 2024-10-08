<script>
	import * as d3 from 'd3';
	import { computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { base } from '$app/paths';

	export let codices;
	export let width = 400;
	export let height = 400;
	export let data_start = 1;
	/**
	 * @type {{values: boolean[], label: string}[]}
	 */
	export let data = [];
	$: contigousData = data.map((d) => {
		if (d.label === 'fr') {
			return d;
		}
		let contiguousRanges = [];
		let start = 0;
		for (let i = 0; i < d.values.length; i++) {
			if (d.values[i]) {
				if (start === 0) {
					start = i + data_start;
				}
			} else {
				if (start !== 0) {
					contiguousRanges.push([start, i - 1 + data_start]);
					start = 0;
				}
			}
		}
		if (start !== 0) {
			contiguousRanges.push([start, d.values.length - 1 + data_start]);
		}
		return {
			label: d.label,
			values: contiguousRanges
		};
	});
	let marginTop = 30;
	let marginRight = 0;
	let marginBottom = 20;
	let marginLeft = 35;

	/**
	 * @type {SVGGElement}
	 */
	let gx;
	/**
	 * @type {SVGGElement}
	 */
	let gy;
	/**
	 * @type {number[]}
	 */
	let mousePos = [0, 1];

	/**
	 * @type {HTMLElement}
	 */
	let floating;
	/**
	 * @type {HTMLElement}
	 */
	let hoverLine;

	/**
	 * @type {SVGElement}
	 */
	let svgElement;

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
	$: x = d3
		.scaleBand(
			data.map((d) => d.label),
			[marginLeft, width - marginRight]
		)
		.round(true)
		.paddingOuter(0.1)
		.paddingInner(0.2);

	$: y = d3.scaleLinear(
		[data_start, data_start + data[0]?.values.length],
		[height - marginBottom, marginTop]
	);
	$: manuscript =
		scaleBandInvert(x)(mousePos[0]) === 'fr'
			? data.find((d) => d.label === 'fr')?.values[verse - data_start] || 'fr'
			: scaleBandInvert(x)(mousePos[0]);

	$: d3.select(gy)
		.call(
			d3
				.axisRight(y)
				.ticks(20)
				.tickSize(width - marginLeft - marginRight)
		)
		.call((/** @type import('d3-selection').Selection<SVGGElement, any, null, undefined> */ g) => {
			g.selectAll('.tick text').attr('x', -25);
		});
	$: d3.select(gx)
		.call(
			d3.axisTop(
				d3
					.scaleBand(
						data.map((d) => codices.find((i) => i.handle === d.label)?.sigil || d.label),
						[marginLeft, width - marginRight]
					)
					.round(true)
					.paddingOuter(0.1)
					.paddingInner(0.2)
			)
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
				popup.style.opacity = '0';
			}
		});

	$: verse = Math.floor(y.invert(mousePos[1]));
	const popupFractions = {};
	const popupLabels = {};
	const openPopupFractions = (e, verseNumber) => {
		const reference = e.currentTarget;
		const popup = popupFractions[verseNumber];
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
</script>

<div
	class="card p-1 variant-filled-primary fixed top-0 left-0 w-max"
	data-popup="popupVerse"
	bind:this={floating}
>
	{#if Array.isArray(manuscript)}
		<ul>
			{#each manuscript as sigla}
				<li>
					<a href={`${base}/textzeugen/${sigla}/${verse}`} class="hover:text-secondary-900">
						{sigla}
						{verse}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>{manuscript} {verse}</p>
	{/if}
</div>
{#each data.map((d) => d.label) as label}
	<div
		class="card p-1 variant-filled-primary absolute opacity-0 top-0 left-0 w-max"
		bind:this={popupLabels[label]}
	>
		<p>Hier stehen Erläuterungen zu {label}</p>
	</div>
{/each}
{#each data.find((d) => d.label === 'fr')?.values || [] as fraction, i}
	{#if Array.isArray(fraction)}
		{@const verse = i + data_start}
		<div
			class="card p-1 variant-filled-primary top-0 left-0 w-max absolute opacity-0"
			bind:this={popupFractions[verse]}
		>
			<ul>
				{#each fraction as sigla}
					<li>
						<a href={`${base}/textzeugen/${sigla}/${verse}`} class="hover:text-secondary-900">
							{sigla}
							{verse}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/each}
<div
	on:mousemove={handleMouseMove}
	on:mouseleave={(_e) => {
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
						{@const verseNumber = i + data_start}
						{#if isNaN(values[0])}
							{#if values.length === 1}
								<a href={`${base}/textzeugen/${values[0]}/${verseNumber}`}>
									<rect
										x={x(sigla.label)}
										y={y(verseNumber + 1)}
										width={x.bandwidth()}
										height={y(verseNumber) - y(verseNumber + 1)}
										fill="currentColor"
										class="hover:text-primary-500"
									/>
								</a>
							{:else}
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a
									role="button"
									tabindex="0"
									href="#"
									on:keydown={(e) => openPopupFractions(e, verseNumber)}
									on:click|preventDefault|stopPropagation={(e) =>
										openPopupFractions(e, verseNumber)}
									on:blur={() => {
										popupFractions[verseNumber].style.opacity = '0';
									}}
								>
									<rect
										x={x(sigla.label)}
										y={y(verseNumber + 1)}
										width={x.bandwidth()}
										height={y(verseNumber) - y(verseNumber + 1)}
										fill="currentColor"
										class="hover:text-primary-500"
									/>
								</a>
							{/if}
						{:else if sigla.label === 'Fassung'}
							<a href={`${base}/fassungen/${verse}`}>
								<rect
									x={x(sigla.label)}
									y={y(values[1] + 1)}
									width={x.bandwidth()}
									height={y(values[0]) - y(values[1] + 1)}
									fill="currentColor"
									class="hover:text-primary-500"
								/>
							</a>
						{:else}
							<a href={`${base}/textzeugen/${sigla.label}/${verse}`}>
								<rect
									x={x(sigla.label)}
									y={y(values[1] + 1)}
									width={x.bandwidth()}
									height={y(values[0]) - y(values[1] + 1)}
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
