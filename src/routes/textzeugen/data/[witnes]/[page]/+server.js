import { json } from '@sveltejs/kit';
import { api, teipb } from '$lib/constants';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const teipbData = fetch(
		`${teipb}/parts/${params.witnes}.xml/json?&view=page&id=${params.page}&odd=parzival-verse.odd`
	).then((r) => {
		if (!r.ok) {
			console.error('Failed to fetch tpData', r);
			return false;
		}
		return r.json();
	});
	return json(await teipbData);
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const { codices, fragments } = await metadata;
	const handles = [...codices, ...fragments].map((c) => c.handle);
	const metadataPage = handles.map((h) =>
		fetch(`${api}/json/metadata-ms-page/${h}.json`).then((r) => r.json())
	);

	/**
	 * @type {PromiseLike<import("./$types").RouteParams[]> | { witnes: string; page: any; }[]}
	 */
	const returnObjects = [];
	const resolvedMetadata = await Promise.all(metadataPage);
	handles.forEach((handle) => {
		const data = resolvedMetadata.find((r) => r[handle])[handle];
		data.forEach((page) => {
			returnObjects.push({ witnes: handle, page: page.id });
		});
	});

	return returnObjects;
}

export const prerender = true;
