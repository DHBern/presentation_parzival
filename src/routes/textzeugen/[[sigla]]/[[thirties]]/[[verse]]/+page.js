import { api, teipb } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const { codices, fragments } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) =>
		r.json()
	);
	const sigla = params.sigla?.split('-');

	/** @type string | boolean */
	let thirties = params.thirties ?? '1';
	/** @type string | boolean */
	let verse = params.verse?.padStart(2, '0') ?? '01';
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
					.find((/** @type {String} **/ l) => l.startsWith(String(thirties)))
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

			if (selectedIndex > 0) returnObjects.push(data[witnes][selectedIndex - 1] ?? {});
			returnObjects.push(data[witnes][selectedIndex] ?? {});
			if (selectedIndex <= data[witnes].length - 1)
				returnObjects.push(data[witnes][selectedIndex + 1] ?? {});
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
				returnObject.tpData = fetch(
					`${teipb}/parts/${witnes}.xml/json?&view=page&id=${returnObject.id}&odd=parzival.odd`
				).then((r) => {
					if (!r.ok) {
						console.error('Failed to fetch tpData', r);
						return false;
					}
					return r.json();
				});
			}
			return returnObject;
		});
		return returnObjects.length
			? returnObjects.map((returnObject) => {
					return { tpData: returnObject.tpData, iiif: returnObject.iiif, page: returnObject.id };
				})
			: [{ tpData: false, iiif: false, page: false }];
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
		})
	};
}
