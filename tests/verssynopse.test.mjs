import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const witnesses = [
	{ handle: 'g', sigil: 'G' },
	{ handle: 'w', sigil: 'W' },
	{ handle: 'u', sigil: 'U' },
	{ handle: 'fr18', sigil: 'Fr. 18' },
	{ handle: 'fr69', sigil: 'Fr. 69' }
];
const metadata = {
	codices: [...witnesses.slice(0, 3), { handle: 'd', sigil: 'D' }],
	fragments: [...witnesses.slice(3), { handle: 'fr1', sigil: 'Fr. 1' }],
	hyparchetypes: [
		{ handle: '*G', sigil: '*G', witnesses: ['g', 'w'] },
		{ handle: '*m', sigil: '*m', witnesses: [] },
		{ handle: '*T', sigil: '*T', witnesses: ['u'] }
	]
};
const verses = witnesses.flatMap(({ handle }) =>
	Array.from({ length: 30 }, (_, i) => ({
		siglum: handle,
		thirties: '643',
		verse: String(i + 1).padStart(2, '0')
	}))
);

let server;
let load;

before(async () => {
	server = await createServer({
		configFile: false,
		optimizeDeps: { noDiscovery: true },
		server: { middlewareMode: true },
		plugins: [
			{
				name: 'edition-data-fixtures',
				resolveId(id) {
					if (id === '$lib/data/metadata' || id === '$lib/data/verses') return `\0${id}`;
					if (id.startsWith('$lib/')) {
						return fileURLToPath(new URL(`../src/lib/${id.slice(5)}.js`, import.meta.url));
					}
				},
				load(id) {
					if (id === '\0$lib/data/metadata') {
						return `export const metadata = Promise.resolve(${JSON.stringify(metadata)});`;
					}
					if (id === '\0$lib/data/verses') {
						return `export const verses = Promise.resolve(${JSON.stringify(verses)});`;
					}
				}
			}
		]
	});
	({ load } = await server.ssrLoadModule(
		fileURLToPath(
			new URL(
				'../src/routes/verssynopse/[thirties=thirties]/[verse]/+page.server.js',
				import.meta.url
			)
		)
	));
});

after(async () => {
	await server?.close();
});

async function loadVerse(verse, distribution, unavailable = []) {
	return load({
		params: { thirties: '643', verse },
		fetch: async (url) => {
			if (url.endsWith('/syn643.json')) {
				return Response.json({
					versions: [
						{ handle: '*G', distribution },
						{ handle: '*m', distribution: '<ul><li><a>W</a></li></ul>' },
						{
							handle: '*T',
							distribution: '<ul><li><a>U</a> <span>(Leithandschrift ab 643.15)</span></li></ul>'
						}
					]
				});
			}
			if (unavailable.some((handle) => url.includes(`/parts/${handle}.xml/`))) {
				return new Response(null, { status: 404 });
			}
			const id = new URL(url).searchParams.get('id');
			return Response.json({ id, content: '<span>Verse text</span>' });
		}
	});
}

for (const [verse, expected] of [
	['01', ['g', 'fr18']],
	['24', ['g', 'fr18']],
	['25', ['g']],
	['29', ['g']],
	['30', ['g', 'fr18']]
]) {
	test(`uses distribution ranges and isolated verses at 643.${verse}`, async () => {
		const result = await loadVerse(
			verse,
			'<ul><li><a>G</a></li><li><a>Fr18</a> <span>(643.1–24 und 30)</span></li></ul>'
		);
		assert.deepEqual(result.metadata.hyparchetypes[0].witnesses, expected);
	});
}

test('handles comma-separated ranges without including the gaps', async () => {
	const distribution = '<a>Fr69</a> <span>(643.3–6, 9–11 und 28–30)</span>';
	for (const [verse, expected] of [
		['03', ['fr69']],
		['07', []],
		['10', ['fr69']],
		['20', []],
		['28', ['fr69']]
	]) {
		const result = await loadVerse(verse, distribution);
		assert.deepEqual(result.metadata.hyparchetypes[0].witnesses, expected);
	}
});

test('retains hyphenated ranges', async () => {
	const distribution = '<a>Fr18</a> <span>(643.10-12)</span>';
	assert.deepEqual((await loadVerse('10', distribution)).metadata.hyparchetypes[0].witnesses, [
		'fr18'
	]);
	assert.deepEqual((await loadVerse('13', distribution)).metadata.hyparchetypes[0].witnesses, []);
});

test('moves witnesses between hyparchetypes without mutating their display sigils', async () => {
	const result = await loadVerse('10', '<a>G</a><a>Fr18</a>');
	assert.deepEqual(result.metadata.hyparchetypes[0].witnesses, ['g', 'fr18']);
	assert.deepEqual(result.metadata.hyparchetypes[1].witnesses, ['w']);
	assert.equal(result.metadata.fragments[0].sigil, 'Fr. 18');
});

test('does not interpret lead-manuscript notes as witness restrictions', async () => {
	const result = await loadVerse('01', '<a>G</a>');
	assert.deepEqual(result.metadata.hyparchetypes[2].witnesses, ['u']);
	assert.equal(result.metadata.hyparchetypes[2].sigil, '*T(Q)');
});

test('keeps witness text available even when it has no distribution assignment', async () => {
	const result = await loadVerse('25', '<a>G</a><a>Fr18</a> <span>(643.1–24)</span>');
	assert.ok(result.publisherData.fr18[0].content);
});

test('lists codices skipped by the verse index as loss, excluding fragments', async () => {
	const result = await loadVerse('25', '<a>G</a>');
	assert.deepEqual(result.loss, ['D']);
	assert.equal(result.publisherData.d, undefined);
	assert.equal(result.publisherData.fr1, undefined);
});

test('includes failed codex fetches in loss but not missing hyparchetype texts', async () => {
	const result = await loadVerse('25', '<a>G</a>', ['g', 'syn643', 'fr18']);
	assert.deepEqual(result.loss, ['G', 'D']);
});

test('does not list fetched codices as loss when absent from distributions', async () => {
	const result = await loadVerse('25', '');
	assert.deepEqual(result.loss, ['D']);
	assert.ok(result.publisherData.g[0].content);
});
