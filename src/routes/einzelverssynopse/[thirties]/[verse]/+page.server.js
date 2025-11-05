import { URL_TEI_PB } from '$lib/constants';
import { generateEntries } from '$lib/functions/generateEntries';
import { metadata } from '$lib/data/metadata';
import siglaFromHandle from '$lib/functions/siglaFromHandle';
import { verses } from '$lib/data/verses';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};

	const thirties = params.thirties ?? '1';
	const verseparts = params?.verse?.split('-');
	let verse = '01';

	if (verseparts.length > 1) {
		verse = verseparts[0].padStart(2, '0') + '-' + verseparts.slice(1).join('-');
	} else if (verseparts.length === 1) {
		verse = verseparts[0].padStart(2, '0');
	}

	// Fetch the textzeugen
	(await metadata).codices.forEach((/** @type {{ handle: string | number; }} */ element) => {
		publisherData[element.handle] = fetch(
			`${URL_TEI_PB}/parts/${element.handle}.xml/json?odd=parzival.odd&view=page&id=${element.handle}_${thirties}.${verse}`
		);
	});

	// Fetch fassungen
	(await metadata).hyparchetypes.forEach((/** @type {{ handle: string | number; }} */ element) => {
		publisherData[element.handle] = fetch(
			`${URL_TEI_PB}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//l[@n=%27${element.handle}%20${thirties}.${verse}%27]`
		);
	});

	/** @type {string[]} */
	let loss = [];
	// Wait for all promises to resolve and filter those with status 200
	const resolvedPublisherData = await Promise.all(
		Object.entries(publisherData).map(async ([key, promise]) => {
			let response = await promise;
			let data = null;
			if (response.status === 200) {
				data = await response.json();
			} else {
				const response = await fetch(
					`${URL_TEI_PB}/parts/${key}.xml/json?odd=parzival.odd&view=page&id=${key}_${thirties}.${verse}-a`
				);
				if (response.status === 200) {
					data = await response.json();
				} else {
					const response = await fetch(
						`${URL_TEI_PB}/parts/${key}.xml/json?odd=parzival.odd&view=page&id=${key}_${thirties}.${verse}-k`
					);
					if (response.status === 200) {
						data = await response.json();
					}
				}
			}
			if (data === null) {
				loss.push(key);
				return null;
			}
			return [key, data];
		})
	).then((results) => results.filter((result) => result !== null));

	// Convert array back to object
	const resolvedPublisherDataObject = Object.fromEntries(resolvedPublisherData);
	/** @type {{siglum:string, thirties: string, verse: string}[]} */
	let startobj = []; //This is just for typing purposes
	const filteredVerses = /** @type {{siglum:string, thirties: string, verse: string}[]} */ (
		await verses
	)
		.filter((v) => !v.siglum.includes('fr'))
		// de-duplicate by thirties+verse (keep first occurrence)
		.reduce(
			(acc, curr) => {
				const key = `${curr.thirties}|${curr.verse}`;
				if (!acc.seen.has(key)) {
					acc.seen.add(key);
					acc.items.push(curr);
				}
				return acc;
			},
			{ seen: new Set(), items: startobj }
		)
		.items // sort: by thirties (numeric), then verse with hierarchical dashes:
		.sort((a, b) => {
			const thA = Number(a.thirties);
			const thB = Number(b.thirties);
			if (thA !== thB) return thA - thB;

			// parse "12", "12-1", "12-a", "12-a-2", etc.
			const parse = (/** @type {string} */ s) => {
				const parts = String(s).split('-');
				const base = Number(parts.shift());
				const tokens = parts.map((p) => {
					// numeric tokens first, then alpha tokens
					if (/^\d+$/.test(p)) return { t: 'num', v: Number(p) };
					return { t: 'str', v: p.toLowerCase() };
				});
				return { base, tokens };
			};

			const A = parse(a.verse);
			const B = parse(b.verse);

			if (A.base !== B.base) return A.base - B.base;

			const len = Math.max(A.tokens.length, B.tokens.length);
			for (let i = 0; i < len; i++) {
				const ta = A.tokens[i];
				const tb = B.tokens[i];
				// shorter (no further suffix) comes first: e.g., 12 < 12-1 or 12-a
				if (ta === undefined) return -1;
				if (tb === undefined) return 1;

				if (ta.t === tb.t) {
					if (ta.t === 'num') {
						if (ta.v !== tb.v) return Number(ta.v) - Number(tb.v); // 12-1 < 12-2
					} else {
						const cmp = String(ta.v).localeCompare(String(tb.v)); // 12-a < 12-b
						if (cmp !== 0) return cmp;
					}
				} else {
					// numbers before strings at the same level: 12-1 < 12-a
					return ta.t === 'num' ? -1 : 1;
				}
			}
			return 0;
		});
	const index = filteredVerses.findIndex((v) => v?.thirties === thirties && v?.verse === verse);
	const prevVerse = index > 0 ? filteredVerses[index - 1] : null;

	const nextVerse = index < filteredVerses.length - 1 ? filteredVerses[index + 1] : null;

	return {
		thirties,
		verse,
		metadata: { ...(await metadata), next: nextVerse, prev: prevVerse },
		publisherData: resolvedPublisherDataObject,
		loss: loss.map((/** @type {string} */ element) => siglaFromHandle(element))
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(false);
}

export const prerender = true;
