import { URL_STATIC_API, URL_TEI_PB } from '$lib/constants';
import { generateEntries } from '$lib/functions/generateEntries';
import { metadata } from '$lib/data/metadata';
import sigilFromHandle from '$lib/functions/sigilFromHandle';
import { verses } from '$lib/data/verses';
import pLimit from 'p-limit';
const limit = pLimit(10);

// ---------------------------------------------------------------------------
// Module-level caches – computed once on first access, reused across all pages
// ---------------------------------------------------------------------------

/** @type {Map<string, {siglum:string, thirties:string, verse:string}[]> | null} */
let _verseIndex = null;

/**
 * Build a lookup index keyed by "handle|thirties" → array of verse objects.
 * Replaces the per-page O(V × W) filter with an O(1) Map lookup.
 */
async function getVerseIndex() {
	if (!_verseIndex) {
		_verseIndex = new Map();
		for (const v of await verses) {
			const key = `${v.siglum.toLowerCase()}|${v.thirties}`;
			if (!_verseIndex.has(key)) _verseIndex.set(key, []);
			_verseIndex.get(key).push(v);
		}
	}
	return _verseIndex;
}

/** @type {{siglum:string, thirties: string, verse: string}[] | null} */
let _sortedNavVerses = null;

/**
 * Compute the sorted, deduplicated verse list used for prev/next navigation.
 * This is identical for every page, so we cache it at module level.
 */
async function getSortedNavVerses() {
	if (!_sortedNavVerses) {
		/** @type {{siglum:string, thirties: string, verse: string}[]} */
		let startobj = []; // typing helper
		_sortedNavVerses = /** @type {{siglum:string, thirties: string, verse: string}[]} */ (
			await verses
		)
			.filter((v) => !v.verse.includes('-')) // exclude Zusatzverse for navigation
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
			.items // sort: by thirties (numeric), then verse with hierarchical dashes
			.sort((a, b) => {
				const thA = Number(a.thirties);
				const thB = Number(b.thirties);
				if (thA !== thB) return thA - thB;

				const parse = (/** @type {string} */ s) => {
					const parts = String(s).split('-');
					const base = Number(parts.shift());
					const tokens = parts.map((p) => {
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
					if (ta === undefined) return -1;
					if (tb === undefined) return 1;

					if (ta.t === tb.t) {
						if (ta.t === 'num') {
							if (ta.v !== tb.v) return Number(ta.v) - Number(tb.v);
						} else {
							const cmp = String(ta.v).localeCompare(String(tb.v));
							if (cmp !== 0) return cmp;
						}
					} else {
						return ta.t === 'num' ? -1 : 1;
					}
				}
				return 0;
			});
	}
	return _sortedNavVerses;
}

/**
 * @param {string} distribution
 * @param {{ handle: string, sigil: string }[]} witnesses
 * @param {string} thirties
 * @param {string} verse
 */
function witnessesForVerse(distribution, witnesses, thirties, verse) {
	const sigils = new Set();
	const links = distribution.matchAll(/<a\b[^>]*>([^<]*)<\/a>(?:\s*<span\b[^>]*>(.*?)<\/span>)?/gi);
	for (const [, sigil, annotation] of links) {
		const note = annotation?.replace(/<[^>]*>/g, '').trim();
		// Lead-manuscript notes describe editorial roles, not witness coverage.
		if (note && /^\(\d+\./.test(note)) {
			const restriction = note.match(/^\((\d+)\.(.*)\)$/);
			if (!restriction) throw new Error(`Invalid witness distribution: ${note}`);
			const ranges = restriction[2].split(/\s*(?:,|\bund\b)\s*/).map((range) => {
				const bounds = range.match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);
				if (!bounds) throw new Error(`Invalid witness distribution range: ${range}`);
				return [Number(bounds[1]), Number(bounds[2] ?? bounds[1])];
			});
			const verseNumber = Number(verse.split('-')[0]);
			if (
				Number(restriction[1]) !== Number(thirties) ||
				!ranges.some(([start, end]) => verseNumber >= start && verseNumber <= end)
			) {
				continue;
			}
		}
		sigils.add(sigil.trim());
	}
	return witnesses
		.filter(({ sigil }) => sigils.has(sigil.replace(/^Fr\.\s*/, 'Fr')))
		.map(({ handle }) => handle);
}

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

	// Use cached sorted verse list for prev/next navigation (computed once)
	const filteredVerses = await getSortedNavVerses();
	const index = filteredVerses.findIndex(
		(v) => v?.thirties === thirties && v?.verse === verse.split('-')[0]
	);
	const prevVerse = index > 0 ? filteredVerses[index - 1] : null;

	const nextVerse = index < filteredVerses.length - 1 ? filteredVerses[index + 1] : null;

	// Fetch the textzeugen – use the pre-built index for O(1) lookups
	const verseIndex = await getVerseIndex();
	const hasSuffix = verseparts[1]; // check if there is a suffix in the URL
	await Promise.all(
		[...(await metadata).codices, ...(await metadata).fragments].map(
			async (/** @type {{ handle: string | number; }} */ element) => {
				// O(1) index lookup instead of filtering the entire verses array
				const witnessVerses = verseIndex.get(`${element.handle}|${thirties}`) ?? [];

				/** @type {{siglum:string, thirties:string, verse:string}[]} */
				let versesToFetch;
				if (hasSuffix) {
					versesToFetch = witnessVerses.filter((v) => v.verse === verse);
				} else {
					versesToFetch = witnessVerses.filter((v) => v.verse.startsWith(verse));
				}

				// Skip witnesses that have no matching verses – avoids unnecessary work
				if (versesToFetch.length === 0) return;

				if (hasSuffix) {
					hasAdditions = true;
				} else if (versesToFetch.length >= 2) {
					const regexp = new RegExp(`-\\d`);
					if (versesToFetch.some((v) => regexp.test(v.verse))) {
						hasAdditions = true;
					}
				}

				publisherData[element.handle] = versesToFetch.map((verseObject) => {
					return limit(() =>
						fetch(
							`${URL_TEI_PB}/parts/${element.handle}.xml/json?odd=parzival.odd&view=page&id=${element.handle}_${thirties}.${verseObject.verse}`
						)
					);
				});
			}
		)
	);

	// Fetch fassungen
	if (!hasSuffix) {
		(await metadata).hyparchetypes.forEach(
			(/** @type {{ handle: string | number; }} */ element) => {
				const handlePath = encodeURIComponent(String(element.handle));
				publisherData[element.handle] = [
					limit(() =>
						fetch(
							`${URL_TEI_PB}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//l[@n=%27${handlePath}%20${thirties}.${verse.replaceAll('I', 'i')}%27]`
						)
					)
				];
			}
		);
	}

	// Wait for all promises to resolve and filter those with status 200
	await metadata;
	const resolvedPublisherData = await Promise.all(
		Object.entries(publisherData).map(async ([key, promiseArray]) => {
			let responses = await Promise.all(promiseArray);
			let data = null;
			if (responses.some((res) => res.status === 200)) {
				data = await Promise.all(
					responses.filter((res) => res.status === 200).map(async (res) => await res.clone().json())
				);
			}
			if (data === null) {
				return null;
			}
			return [key, data];
		})
	).then((results) => results.filter((result) => result !== null));

	// Convert array back to object
	const resolvedPublisherDataObject = Object.fromEntries(resolvedPublisherData);
	const loss = (await metadata).codices
		.filter(
			(/** @type {{ handle: string }} */ codex) =>
				!Object.hasOwn(resolvedPublisherDataObject, codex.handle)
		)
		.map((/** @type {{ handle: string }} */ codex) => codex.handle);

	// get distributions and enhance the metadata
	const apparatus = await fetch(`${URL_STATIC_API}/json/syn/syn${thirties}.json`);
	if (!apparatus.ok) {
		throw new Error(`Failed to fetch witness distributions: ${apparatus.status}`);
	}
	/** @type {{ handle: string, distribution: string }[]} */
	let apparatusData = (await apparatus.json()).versions;

	let enhancedMetadata = structuredClone(await metadata);
	const witnesses = [...enhancedMetadata.codices, ...enhancedMetadata.fragments];
	for (const hyparchetype of enhancedMetadata.hyparchetypes) {
		hyparchetype.witnesses = [];
	}
	apparatusData.forEach((version) => {
		const targetHyparchetype = enhancedMetadata.hyparchetypes.find(
			(/** @type {{ handle: string }} */ h) => h.handle === version.handle
		);
		if (targetHyparchetype) {
			if (targetHyparchetype.handle === '*T') {
				const thirtiesNum = Number(thirties);
				if (thirtiesNum >= 36 && thirtiesNum <= 157) {
					targetHyparchetype.sigil = `*T(U)`;
				} else if (
					(thirtiesNum >= 573 && thirtiesNum <= 599) ||
					(thirtiesNum >= 643 && thirtiesNum <= 678)
				) {
					targetHyparchetype.sigil = `*T(Q)`;
				}
			}
			targetHyparchetype.witnesses = witnessesForVerse(
				version.distribution,
				witnesses,
				thirties,
				verse
			);
		}
	});
	console.log(enhancedMetadata);
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
