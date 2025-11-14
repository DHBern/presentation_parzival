<script>
	import * as d3 from 'd3';
	import { DATA_MIN, DATA_MAX } from './Devilstable_DEFAULTS.json';
	import siglaFromHandle from '$lib/functions/sigilFromHandle';
	import { onMount } from 'svelte';

	let marginTop = 20;
	let marginRight = 0;
	let marginBottom = 20;
	const optimalChunkWidth = 18;

	/**
	 * @type {SVGGElement}
	 */
	let gx = $state();
	/**
	 * @type {SVGGElement}
	 */
	let gy = $state();

	/**
	 * @type {SVGGElement}
	 */
	let gBrush = $state();

	/** @type {{width?: number, height?: number, data?: {values: boolean[], label: string}[], selection: {start: number, end: number}, modifySelection: function}} */
	let {
		width = 400,
		height = 150,
		data = [
			{
				label: 'D',
				values: []
			},
			{
				label: 'n',
				values: []
			}
		],
		selection = $bindable(),
		modifySelection = $bindable()
	} = $props();

	let mobile = $derived(width > height);
	let marginLeft = $derived(mobile ? 30 : 35);
	let availableWidth = $derived(width - marginLeft - marginRight);
	let numChunks = $derived(
		mobile
			? Math.max(Math.floor(availableWidth / optimalChunkWidth), 1)
			: Math.max(Math.floor((height - marginTop - marginBottom) / optimalChunkWidth), 1)
	);

	// Set ColorScale and check for dark-mode
	let colorScale = $derived(
		d3.scaleThreshold(
			[0.001, 1 / 4, 2 / 4, 3 / 4, 0.9999],
			[
				'fill-surface-50-950',
				'fill-primary-400-600',
				'fill-primary-500',
				'fill-primary-600-400',
				'fill-primary-800-200',
				'fill-primary-950-50'
			]
		)
	);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	let sourcesDim = $derived(d3.scaleBand().domain(data.map((d) => d.label)));
	let xChunk = $derived(
		d3
			.scaleLinear()
			.clamp(true)
			.domain([0, numChunks])
			.range(mobile ? [marginLeft, width - marginRight] : [marginBottom, height - marginTop])
	);
	let valuesDim = $derived(d3.scaleLinear().domain([DATA_MIN, DATA_MAX]).clamp(true));
	/** @type any */
	let x = $derived(
		mobile
			? valuesDim.range([marginLeft, width - marginRight])
			: sourcesDim.range([marginLeft, width - marginRight])
	);
	/** @type any */
	let y = $derived(
		mobile
			? sourcesDim.range([height - marginTop, marginBottom])
			: valuesDim.range([marginBottom, height - marginTop])
	);
	/**
	 * @type {d3.brushX | d3.brushY}
	 */
	let brush = $derived(
		mobile
			? d3.brushX().extent([
					[marginLeft, 0],
					[width - marginRight, height - marginBottom - marginTop]
				])
			: d3.brushY().extent([
					[marginLeft, marginTop],
					[width - marginRight, height - marginBottom]
				])
	);

	modifySelection = (/** @type {number} */ modifier, /** @type {any} */ move) => {
		const startVal = valuesDim.invert(
			xChunk(xChunk.invert(valuesDim(selection.start)) + (move ? modifier : -modifier))
		);
		const endVal = valuesDim.invert(xChunk(xChunk.invert(valuesDim(selection.end)) + modifier));
		if (
			startVal > endVal ||
			(move && selection.end >= DATA_MAX && endVal >= DATA_MAX) ||
			(move && selection.start <= DATA_MIN && startVal <= DATA_MIN)
		) {
			return;
		}
		if (!Math.floor(endVal - startVal)) {
			// this happens when two chunks are selected and user zooms in, or the selection reached the top and user scrolls up, or the selection reached the bottom and user scrolls down
			if (!move) {
				selection.end = endVal;
			}
			return;
		}
		selection.start = startVal;
		selection.end = endVal;
	};

	$effect(() => {
		brush
			.on('brush', (/** @type {{ selection: [number, number]; }} */ e) => {
				if (!e.sourceEvent || !e.selection) return;
				const from = e.selection[0];
				const to = e.selection[1];

				// Update range in Details
				if (Math.abs(from - to) <= DATA_MAX - DATA_MIN) {
					selection.start = Math.round(valuesDim.invert(from));
					selection.end = Math.round(valuesDim.invert(to));
				}
			})
			.on('end', (/** @type {{ selection: [number, number]; }} */ e) => {
				// Return if not triggered by user interaction
				if (!e.sourceEvent || !e.selection) return;

				// Snap the selection to the nearest step
				let [from, to] = e.selection.map((d) => Math.round(xChunk.invert(d)));
				if (to <= from) {
					to = from + 1; // Ensure to is always greater than from
				}

				const thirtiesTo = valuesDim.invert(xChunk(to));
				const thirtiesFrom = valuesDim.invert(xChunk(from));

				// Update range in Details
				selection.start = thirtiesFrom || DATA_MIN;
				selection.end = Math.min(thirtiesTo, DATA_MAX);
			});
	});
	let chunkedData = $derived(
		data.map((dataObject) => {
			const chunked = new Array(numChunks).fill(0);
			const chunkedPresent = new Array(numChunks).fill(0);
			for (let i = 0; i < numChunks; i++) {
				const start = xChunk(i);
				const end = xChunk(i + 1);
				dataObject.values.forEach((present, valIndex) => {
					const pos = valuesDim(valIndex);
					if (pos >= start && pos < end) {
						chunked[i]++;
						if (present) {
							chunkedPresent[i]++;
						}
					} else if (pos >= end) {
						return;
					}
				});
			}

			return {
				label: dataObject.label,
				values: chunked.map((val, i) => {
					return chunkedPresent[i] / val;
				})
			};
		})
	);
	$effect.pre(() => {
		mobile
			? d3.select(gy).call(d3.axisLeft(y).tickFormat((d) => siglaFromHandle(d)))
			: d3.select(gy).call(d3.axisLeft(y));
	});
	$effect.pre(() => {
		mobile
			? d3.select(gx).call(d3.axisBottom(x))
			: d3.select(gx).call(d3.axisTop(x).tickFormat((d) => siglaFromHandle(d)));
	});

	$effect(() => {
		//this effect moves the brush when the selection changes
		d3.select(gBrush)
			.call(brush)
			.call(brush.move, [valuesDim(selection.start), valuesDim(selection.end)]);
	});
	$effect(() => {
		// this effect ensures that the brush is snapped to a chunk
		selection.start = valuesDim.invert(
			xChunk(Math.round(xChunk.invert(valuesDim(selection.start))))
		);
		selection.end = valuesDim.invert(xChunk(Math.round(xChunk.invert(valuesDim(selection.end)))));
	});
</script>

<svg {width} {height} class="float-left" shape-rendering="crispEdges">
	<g bind:this={gy} transform="translate({marginLeft - 5} ,0)" />
	<g bind:this={gx} transform="translate(0,{mobile ? height - marginBottom : marginTop - 1})" />
	{#key y | x}
		{#each chunkedData as d}
			<g>
				{#each d.values as v, j}
					{@const start = xChunk(j)}
					{@const end = xChunk(j + 1)}
					<rect
						x={mobile ? start : x(d.label)}
						y={mobile ? y(d.label) : start}
						width={mobile ? end - start : x.bandwidth()}
						height={mobile ? y.bandwidth() : end - start}
						class={colorScale(v)}
					/>
				{/each}
			</g>
		{/each}
	{/key}
	<g bind:this={gBrush} transform="translate(0,{mobile ? marginTop : 0})" />
</svg>
