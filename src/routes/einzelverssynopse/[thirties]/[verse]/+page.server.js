import { teipb } from '$lib/constants';
import { generateEntries } from '$lib/functions/generateEntries';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};

	const thirties = params.thirties ?? '1';
	const verse = params.verse?.padStart(2, '0') ?? '01';

	// Fetch the textzeugen
	(await metadata).codices.forEach((/** @type {{ handle: string | number; }} */ element) => {
		publisherData[element.handle] = fetch(
			`${teipb}/parts/${element.handle}.xml/json?odd=parzival.odd&view=page&id=${element.handle}_${thirties}.${verse}`
		);
	});

	// Fetch fassungen
	(await metadata).hyparchetypes.forEach((/** @type {{ handle: string | number; }} */ element) => {
		publisherData[element.handle] = fetch(
			`${teipb}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//l[@n=%27${element.handle}%20${thirties}.${verse}%27]`
		);
	});

	/** @type {string[]} */
	let loss = [];
	// Wait for all promises to resolve and filter those with status 200
	const resolvedPublisherData = await Promise.all(
		Object.entries(publisherData).map(async ([key, promise]) => {
			const response = await promise;
			if (response.status === 200) {
				const data = await response.json();
				return [key, data];
			} else {
				loss.push(key);
			}
			return null;
		})
	).then((results) => results.filter((result) => result !== null));

	// Convert array back to object
	const resolvedPublisherDataObject = Object.fromEntries(resolvedPublisherData);

	return {
		thirties,
		verse,
		metadata: await metadata,
		publisherData: resolvedPublisherDataObject,
		loss
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(false);
}

export const prerender = true;
