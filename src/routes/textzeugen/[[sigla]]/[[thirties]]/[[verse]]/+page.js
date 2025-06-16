import { api } from '$lib/constants';
import { base } from '$app/paths';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const { codices, fragments } = await metadata;
	const sigla = params.sigla?.split('-');

	/** @type string | boolean */
	let thirties = params.thirties ?? '1';
	/** @type string | boolean */
	let verse = params.verse?.padStart(2, '0') ?? '01';

	const ranges = await fetch(`${api}/json/contiguous_ranges.json`).then((res) => res.json());

	// if params.thirties is not defined, we need to find the lowest thirty & verse that exists in all siglas
	if (sigla?.length === 1) {
		const lowestPromises = fetch(`${api}/json/metadata-ms-page/${sigla[0]}.json`).then((r) =>
			r.json()
		);
		if (!params.thirties) {
			thirties = false;
			(await lowestPromises)[sigla[0]].forEach((/** @type {{id: String, l: String[]}} **/ page) => {
				if (page.id.includes(`${sigla[0]}001`)) {
					const [tThirty, tVerse] = page.l[0].split('.');
					if (!thirties || Number(tThirty) < Number(thirties)) {
						thirties = tThirty;
						verse = tVerse;
					}
				}
			});
		} else if (!params.verse && typeof thirties === 'string') {
			verse = false;
			(await lowestPromises)[sigla[0]].some((/** @type {{id: String, l: String[]}} **/ page) => {
				const newVerse = page.l
					.find((/** @type {String} **/ l) => l?.startsWith(String(thirties)))
					?.split('.')[1];
				if (newVerse) {
					verse = newVerse;
					return true;
				}
			});
		}
	}

	const meta = sigla?.map(async (witnes) => {
		const data = await fetch(`${api}/json/metadata-ms-page/${witnes}.json`).then((r) => r.json());
		/**  @type {{ iiif: string | Promise<any>, id: string, tpData: Promise<{content: string}> }[]} */
		let returnObjects = [];
		if (thirties) {
			const selectedIndex = data[witnes].findIndex(
				(/** @type {{ l: string, id:string | string[]; }} */ entry) =>
					entry.l.includes(`${thirties}.${verse}`)
			);
			if (selectedIndex === -1) {
				console.warn(`No page found for ${witnes} with thirties ${thirties} and verse ${verse}.`);
				// loop through the l array of all pages and find the page that contains the thirties that is closest to the requested thirties
				const closestPages = data[witnes].reduce(
					(closest, current, i, array) => {
						const lowestThirties = Number(current.l[0].split('.')[0]);
						if (lowestThirties < Number(thirties)) {
							let returnArray = [];
							if (i > 0) {
								returnArray.push(array[i - 1]);
							}
							returnArray.push(current);
							if (i < array.length - 1) {
								returnArray.push(array[i + 1]);
							}
							return returnArray;
						}
						return closest;
					},
					[data[witnes][0], data[witnes][1]]
				);
				returnObjects = closestPages;
			} else {
				if (selectedIndex > 0) {
					returnObjects.push(data[witnes][selectedIndex - 1] ?? {});
				}
				returnObjects.push({ ...data[witnes][selectedIndex], active: true });
				if (selectedIndex <= data[witnes].length - 1) {
					returnObjects.push(data[witnes][selectedIndex + 1] ?? {});
				}
			}
		} else {
			returnObjects = [data[witnes][0], data[witnes][1]];
		}
		returnObjects.map((returnObject) => {
			if (returnObject.iiif && typeof returnObject.iiif === 'string') {
				returnObject.iiif = fetch(returnObject.iiif).then((res) => {
					if (!res.ok) {
						console.error('Failed to fetch iiif', res);
						return false;
					}
					return res.json();
				});
			}
			if (returnObject.id) {
				returnObject.tpData = fetch(`${base}/textzeugen/data/${witnes}/${returnObject.id}`).then(
					(r) => {
						return r.json();
					}
				);
			}
			return returnObject;
		});
		return returnObjects.length ? returnObjects : [{ tpData: false, iiif: false, page: false }];
	});

	return {
		thirties,
		verse,
		codices,
		fragments,
		content: sigla?.map((witnes, i) => {
			return {
				sigla: witnes,
				meta: meta ? meta[i] : false
			};
		}),
		ranges: ranges['contiguous-ranges'].filter((r) => sigla?.includes(r.label))
	};
}
