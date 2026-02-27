import { URL_STATIC_API } from '$lib/constants';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const { codices, fragments } = await metadata;
	const tableData = await fetch(`${URL_STATIC_API}/json/contiguous_ranges.json`).then((res) =>
		res.json()
	);
	tableData['contiguous-ranges'] = tableData['contiguous-ranges'].map((d) => {
		if (d.label.includes('fr')) {
			return {
				...d,
				label: d.label.replace('fr', 'Fr')
			};
		} else {
			return d;
		}
	});
	return {
		tableData,
		codices,
		fragments
	};
}
