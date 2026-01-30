import { URL_TEI_PB, URL_STATIC_API } from '$lib/constants';
import { generateEntries } from '$lib/functions/generateEntries';
import { metadata } from '$lib/data/metadata';
import sigilFromHandle from '$lib/functions/sigilFromHandle';
import { verses } from '$lib/data/verses';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};

	const thirties = Number(params.thirties)?.toString() ?? '1';
	const verseparts = params?.verse?.split('-');
	let verse = '01';
	let hasAdditions = false;

	if (verseparts.length > 1) {
		verse = verseparts[0].padStart(2, '0') + '-' + verseparts.slice(1).join('-');
	} else if (verseparts.length === 1) {
		verse = verseparts[0].padStart(2, '0');
	}

	/** @type {{siglum:string, thirties: string, verse: string}[]} */
	let startobj = []; //This is just for typing purposes
	const filteredVerses = /** @type {{siglum:string, thirties: string, verse: string}[]} */ (
		await verses
	)
		// .filter((v) => !v.siglum.includes('fr'))
		.filter((v) => !v.siglum.includes('fr') && !v.verse.includes('-')) // exclude Zusatzverse for navigation
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
		.items // sort: by thirties (numeric), then verse with hierarchical dashes: // this could be made drastically simpler because we are ignoring dash-verses now, but we keep it in since the sentiment might change.
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

	// Fetch the textzeugen
	const hasSuffix = verseparts[1]; // check if there is a suffix in the URL
	(await metadata).codices.forEach(async (/** @type {{ handle: string | number; }} */ element) => {
		if (hasSuffix) {
			publisherData[element.handle] = [
				fetch(
					`${URL_TEI_PB}/parts/${element.handle}.xml/json?odd=parzival.odd&view=page&id=${element.handle}_${thirties}.${verse}`
				)
			];
		} else {
			const versesToFetch = (await verses).filter(
				(v) =>
					v.siglum.toLowerCase() === element.handle &&
					v.thirties === thirties &&
					v.verse.startsWith(verse)
			);
			if (versesToFetch.length >= 2) {
				const regexp = new RegExp(`-\\d`);
				if (versesToFetch.some((v) => regexp.test(v.verse))) {
					hasAdditions = true;
				}
			}

			publisherData[element.handle] = versesToFetch.map((verseObject) => {
				return fetch(
					`${URL_TEI_PB}/parts/${element.handle}.xml/json?odd=parzival.odd&view=page&id=${element.handle}_${thirties}.${verseObject.verse}`
				);
			});
		}
	});

	// Fetch fassungen
	(await metadata).hyparchetypes.forEach((/** @type {{ handle: string | number; }} */ element) => {
		publisherData[element.handle] = [
			fetch(
				`${URL_TEI_PB}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//l[@n=%27${element.handle}%20${thirties}.${verse}%27]`
			)
		];
	});

	/** @type {string[]} */
	let loss = [];
	// Wait for all promises to resolve and filter those with status 200
	const resolvedPublisherData = await Promise.all(
		Object.entries(publisherData).map(async ([key, promiseArray]) => {
			let responses = await Promise.all(promiseArray);
			let data = null;
			if (responses.some((res) => res.status === 200)) {
				data = await Promise.all(
					responses.filter((res) => res.status === 200).map(async (res) => await res.json())
				);
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

	// get distributions and enhance the metadata
	const apparatus = await fetch(`${URL_STATIC_API}/json/syn/syn${thirties}.json`);
	if (!apparatus.ok) {
		console.log('Failed to fetch apparatus', apparatus);
	}
	let apparatusData = (await apparatus.json()).versions;

	let enhancedMetadata = structuredClone(await metadata);
	apparatusData.forEach((version) => {
		const targetHyparchetype = enhancedMetadata.hyparchetypes.find(
			(h) => h.handle === version.handle
		);
		if (targetHyparchetype) {
			targetHyparchetype.witnesses = enhancedMetadata.codices
				.filter((codex) => {
					if (version.distribution.includes(`>${codex.sigil}</a>`)) {
						// ------------------------
						// GPT wrote this to work around not having a DOM-parser
						const dist = version.distribution ?? '';
						const sigil = codex.sigil;
						const linkRegex = new RegExp(
							`<a\\b[^>]*>([^<]*${sigil.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}[^<]*)<\\/a>`,
							'i'
						);
						const linkMatch = dist.match(linkRegex);
						const afterLink = linkMatch
							? dist.slice(dist.indexOf(linkMatch[0]) + linkMatch[0].length)
							: '';
						const spanMatch = afterLink.match(/^\s*<span\b[^>]*>(.*?)<\/span>/i);
						const nextSibling =
							spanMatch && spanMatch[1] ? spanMatch[1].replace(/<[^>]*>/g, '').trim() : null;
						// ------------------------
						if (nextSibling) {
							//parse the verse-info

							const verseMinMax = nextSibling.match(/\.(\d{1,3})-(\d{1,3})/);
							if (
								verseMinMax &&
								Number(verseparts[0]) >= Number(verseMinMax[1]) &&
								Number(verseparts[0]) <= Number(verseMinMax[2])
							) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					} else {
						return false;
					}
				})
				.map((codex) => codex.handle);
		}
	});

	return {
		thirties,
		verse,
		metadata: {
			...enhancedMetadata,
			next: nextVerse,
			prev: prevVerse,
			hasAdditions
		},
		publisherData: resolvedPublisherDataObject,
		loss: loss.map((/** @type {string} */ element) => sigilFromHandle(element))
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(false);
}

export const prerender = true;
