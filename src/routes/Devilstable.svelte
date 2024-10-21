<script>
	import { run } from 'svelte/legacy';

	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';

	const DATA_MAX = 827;

	const brushDimension = 200;

	let selection = $state({ start: 1, end: 100 });

	/** @type {{codices: any, width?: number, height?: number, data?: {values: number[][], label: string}[]}} */
	let {
		codices,
		width = 400,
		height = 400,
		data = [
			{
				label: 'D',
				values: [
					[1, 3],
					[15, 20]
				]
			},
			{
				label: 'n',
				values: [
					[1, 16],
					[18, 25]
				]
			}
		]
	} = $props();

	/**
	 * @type {{values: boolean[], label: string}[]}
	 */
	let mobile = $derived(width < 800);
	let [fractions, noFractions] = $derived(
		data.reduce(
			/**
			 *
			 * @param {[{values: number[][], label: string}[],{values: number[][], label: string}[]]} acc
			 * @param item
			 */
			(acc, item) => {
				// Determine which sub-array to push the item into based on whether it includes the substring.
				item.label.includes('fr') ? acc[0].push(item) : acc[1].push(item);
				return acc;
			},
			[[], []] // Initial accumulator value is two empty arrays.
		)
	);
	let fractionData = $derived.by(() => {
		//combine all the fractions into one Object with the label 'fr'
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
	let boolData = $derived([
		...noFractions.map((d) => {
			/** @type {boolean[]} */ const values = new Array(DATA_MAX).fill(false);

			d.values.forEach(([start, end]) => {
				for (let i = start; i <= end; i++) {
					// Adjust for 0-indexed array
					values[i - 1] = true;
				}
			});

			return {
				label: d.label,
				values
			};
		}),
		fractionData
	]);
</script>

<Brush
	height={mobile ? brushDimension : height}
	width={mobile ? width : brushDimension}
	data={boolData}
	on:brush={(e) => (selection = e.detail)}
/>
<Detail
	{codices}
	width={mobile ? width : width - brushDimension}
	height={mobile ? height - brushDimension : height}
	data={[
		{
			label: 'Fassung',
			values: new Array(DATA_MAX).fill(true)
		},
		...boolData
	].map((d) => {
		return { label: d.label, values: d.values.slice(selection.start - 1, selection.end + 1) };
	})}
	data_start={selection.start}
/>

<style>
	:global(.tick text) {
		font-size: 0.75rem;
	}
</style>
