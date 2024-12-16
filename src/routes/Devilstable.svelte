<script>
	import { InputChip, popup } from '@skeletonlabs/skeleton';
	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';
	import { summaryLabel } from '$lib/constants';
	import {
		DATA_MAX,
		BRUSH_WINDOW_DEFAULT_START,
		BRUSH_WINDOW_DEFAULT_END
	} from './Devilstable_DEFAULTS.json';
	const brushDimension = 200;
	const brushDimensionWithSafetyPixel = brushDimension + 1; // fixes a glitch, where Brush and Detail don't fit next to each other on PageResize.

	/** @type {{codices: any, width?: number, height?: number, data?: {values: number[][], label: string}[]}} */
	let { codices, width = 400, height = 400, data = [] } = $props();

	let mobile = $derived(width < 800);
	const defaultChips = [summaryLabel, ...codices.map((c) => c.sigil), 'fr'];
	let inputChipValues = $state(defaultChips);
	let inputChipValueLabels = $derived(
		inputChipValues.map((v) => codices.find((c) => c.sigil === v)?.handle ?? v)
	);
	let fractions = $derived(data.filter((d) => d.label.includes('fr')));
	/** @type {{label: string, values: boolean[]}} */
	let allFractionData = $derived.by(() => {
		if (!inputChipValueLabels.includes('fr')) return {};
		//combine all the fractions into one Object with the label 'fr'
		/** @type {{label: string, values: boolean[]}} */
		let fractionData = {
			label: 'fr',
			values: new Array(DATA_MAX).fill(false)
		};
		//loop DATA_MAX times and check if the value is in any of the fractions
		for (let i = 0; i < DATA_MAX; i++) {
			//check if the value is in any of the fractions
			for (let j = 0; j < fractions.length; j++) {
				//check if the value is in the range of the fraction
				if (fractions[j].values.some(([start, end]) => i + 1 >= start && i + 1 <= end)) {
					//if the value is in the range of the fraction, add the label to the array
					if (Array.isArray(fractionData.values[i])) {
						fractionData.values[i] = [...fractionData.values[i], fractions[j].label];
					} else {
						fractionData.values[i] = [fractions[j].label];
					}
				}
			}
		}
		return fractionData;
	});
	/** @type {{label: string, values: boolean[]}[]} */
	let boolData = $derived(
		inputChipValueLabels.map((c) => {
			if (c === 'fr') {
				return allFractionData;
			} else if (c === summaryLabel) {
				return {
					label: c,
					values: new Array(DATA_MAX).fill(true)
				};
			} else {
				const entry = data.find((d) => d.label === c);
				if (!entry) console.error(`Could not find data for ${c}`);
				/** @type {boolean[]} */ const values = new Array(DATA_MAX).fill(false);
				entry?.values.forEach(([start, end]) => {
					values.fill(true, start - 1, end);
				});

				return {
					label: c,
					values
				};
			}
		})
	);
	let selection = $state({
		start: BRUSH_WINDOW_DEFAULT_START,
		end: BRUSH_WINDOW_DEFAULT_END
	});
	$inspect(selection);
	let detailData = $derived(
		boolData.map(({ values, ...rest }) => ({
			values: values.slice(selection.start - 1, selection.end),
			...rest
		}))
	);
</script>

<div class="card p-4 variant-filled-primary max-w-lg" data-popup="popupChips">
	<p>
		Um Textzeugen und Fragmente zu entfernen, klicken Sie bitte auf die grau hinterlegten Kästchen.
	</p>
	<p>
		Um einen Textzeugen hinzuzufügen, geben Sie die SIgle des Textzeugen ein. Z. B. <i>D</i>.
	</p>
	<p>
		Um einzelne Fragmente hinzuzufügen geben sie <i>fr</i> gefolgt vom Index des Fragments (1-72)
		ein. Z. B.
		<i>fr32</i>. Um alle Fragmente in einer Spalte hinzuzufügen, geben Sie <i>fr</i> (ohne index) ein.
	</p>
	<div class="arrow variant-filled-primary"></div>
</div>
<div
	class="container mx-auto mb-6 flex flex-wrap md:flex-nowrap gap-4"
	use:popup={{
		event: 'focus-click',
		placement: 'top',
		target: 'popupChips',
		middleware: { flip: { mainAxis: false } }
	}}
>
	<InputChip
		whitelist={[
			summaryLabel,
			'fr',
			...codices.map((c) => c.sigil),
			...fractions.map((f) => f.label)
		]}
		bind:value={inputChipValues}
		placeholder="Textzeuge / Fragment hinzufügen..."
		name="inputChips"
		allowUpperCase
	/>
	<div class="btn-group md:btn-group-vertical variant-filled h-min m-auto">
		<button
			class="btn variant-filled"
			onclick={() => {
				inputChipValues = defaultChips;
			}}
		>
			zurücksetzen
		</button>
		<button
			class="btn variant-filled"
			onclick={() => {
				inputChipValues = [];
			}}
		>
			Alle entfernen
		</button>
	</div>
</div>
<Brush
	width={mobile ? width : brushDimension}
	height={mobile ? brushDimension : height}
	data={boolData.filter((d) => d.label !== summaryLabel)}
	brushE={(/** @type {{ start: number; end: number; }} */ e) => {
		selection.start = e.start;
		selection.end = e.end;
	}}
/>
<Detail
	{codices}
	width={mobile ? width : width - brushDimensionWithSafetyPixel}
	height={mobile ? height - brushDimension : height}
	data={detailData}
	bind:data_start={selection.start}
/>

<style>
	:global(.tick text) {
		font-size: 0.75rem;
	}
</style>
