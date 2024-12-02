<script>
	import * as d3 from 'd3';

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

	/** @type {{width?: number, height?: number, DATA_MIN?: number, DATA_MAX?: number, data?: {values: boolean[], label: string}[], brushE: function}} */
	let {
		width = 400,
		height = 150,
		DATA_MIN = 1,
		DATA_MAX = 827,
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
		brushE
	} = $props();

	let mobile = $derived(width > height);
	let marginLeft = $derived(mobile ? 30 : 35);
	let availableWidth = $derived(width - marginLeft - marginRight);
	let numChunks = $derived(
		mobile
			? Math.max(Math.floor(availableWidth / optimalChunkWidth), 1)
			: Math.max(Math.floor((height - marginTop - marginBottom) / optimalChunkWidth), 1)
	);
	let colorScale = $derived(
		d3
			.scaleThreshold()
			.domain([0.001, 1 / 4, 2 / 4, 3 / 4, 0.9999])
			.range(['900', '600', '500', '400', '200', '50'])
	);
	// $: colorScale = d3.scaleQuantize([0, 1], ['50', '200', '400', '500', '600', '900']);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	let sourcesDim = $derived(d3.scaleBand().domain(data.map((d) => d.label)));
	let xChunk = $derived(
		d3
			.scaleLinear()
			.domain([0, numChunks])
			.range(mobile ? [marginLeft, width - marginRight] : [marginBottom, height - marginTop])
	);
	let valuesDim = $derived(d3.scaleLinear().domain([DATA_MIN, DATA_MAX]));
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
	$effect(() => {
		brush
			.on('brush', (/** @type {{ selection: [number, number]; }} */ e) => {
				const from = e.selection[0];
				const to = e.selection[1];
				if (Math.abs(from - to) <= 180) {
					const start = Math.round(valuesDim.invert(from));
					const end = Math.round(valuesDim.invert(to));

					brushE({ start, end });
				}
			})
			.on('end', (/** @type {{ selection: [number, number]; }} */ e) => {
				const from = e.selection[0];
				const to = e.selection[1];
				if (Math.abs(from - to) > 180) {
					const start = Math.round(valuesDim.invert(from));
					const end = Math.round(valuesDim.invert(to));

					brushE({ start, end });
				}
			});
	});
	$effect(() => {
		d3.select(gBrush)
			.call(brush)
			.call(brush.move, [valuesDim(DATA_MIN), valuesDim(100)]);
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
		d3.select(gy).call(d3.axisLeft(y));
	});
	$effect.pre(() => {
		mobile ? d3.select(gx).call(d3.axisBottom(x)) : d3.select(gx).call(d3.axisTop(x));
	});
</script>

<svg {width} {height} class="float-left" shape-rendering="crispEdges">
	<g bind:this={gy} transform="translate({marginLeft - 5} ,0)" />
	<g bind:this={gx} transform="translate(0,{mobile ? height - marginBottom : marginTop - 1})" />
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
					fill={`rgb(var(--color-primary-${colorScale(v)}))`}
				/>
			{/each}
		</g>
	{/each}
	<g bind:this={gBrush} transform="translate(0,{mobile ? marginTop : 0})" />
</svg>
