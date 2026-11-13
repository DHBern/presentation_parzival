import { test } from 'node:test';
import assert from 'node:assert/strict';

const entries = [
	{
		id: 'd',
		slug: 'transkriptionen/d',
		citation_doi: 'https://doi.org/10.………/d',
		citation_scope: 'Transkription'
	},
	{
		id: 'g',
		slug: 'transkriptionen/g',
		citation_doi: 'https://doi.org/10.12345/g',
		citation_scope: 'Transkription'
	},
	{
		id: 'textzeugen',
		slug: 'textzeugen',
		citation_doi: 'https://doi.org/10.12345/textzeugen',
		citation_scope: 'Textzeugenansicht'
	},
	{
		id: 'project',
		slug: '',
		citation_doi: 'https://doi.org/10.12345/project',
		citation_scope: null
	},
	{
		id: 'parzival',
		slug: '',
		citation_doi: 'https://doi.org/10.12345/parzival',
		citation_scope: null
	}
];

const originalFetch = globalThis.fetch;
let registryRequests = 0;
let citationModule;
try {
	globalThis.fetch = async (url) => {
		assert.equal(url, 'https://data.parzival.digitaleditions.ch/api/json/citations.json');
		registryRequests++;
		return Response.json(entries);
	};
	citationModule = await import('../src/lib/data/citations.js');
	await citationModule.citations;
} finally {
	globalThis.fetch = originalFetch;
}
const { citations, findCitation, loadCitations, parseCitations } = citationModule;

test('shares one module-level registry fetch across consumers', async () => {
	assert.equal(citations, (await import('../src/lib/data/citations.js')).citations);
	assert.deepEqual(await citations, { citations: entries, citationsError: false });
	assert.equal(registryRequests, 1);
});

test('matches each witness independently and supports non-transcription pages', () => {
	const registry = parseCitations(entries);
	assert.equal(findCitation(registry, { slug: 'transkriptionen/d' })?.id, 'd');
	assert.equal(findCitation(registry, { slug: 'transkriptionen/g' })?.id, 'g');
	assert.equal(findCitation(registry, { slug: 'textzeugen' })?.id, 'textzeugen');
	assert.equal(registry[0].citation_doi, entries[0].citation_doi);
});

test('does not guess missing slugs, prefix matches, or empty-slug projects', () => {
	const registry = parseCitations(entries);
	for (const slug of [
		'transkriptionen',
		'transkriptionen/dd',
		'transkriptionen/d/1/01',
		'unknown',
		''
	]) {
		assert.equal(findCitation(registry, { slug }), undefined);
	}
	assert.equal(findCitation(registry, { id: 'parzival' })?.id, 'parzival');
	assert.equal(findCitation(registry, { id: 'missing', slug: 'textzeugen' }), undefined);
});

test('rejects malformed entries and ambiguous IDs or nonempty slugs', () => {
	for (const data of [
		{},
		[null],
		[{ ...entries[0], citation_doi: 'javascript:alert(1)' }],
		[{ ...entries[0], slug: null }],
		[entries[0], entries[0]],
		[entries[0], { ...entries[0], id: 'different' }]
	]) {
		assert.throws(() => parseCitations(data), /citation registry/i);
	}
});

test('loads registry through the supplied fetch', async () => {
	const result = await loadCitations(async (url) => {
		assert.equal(url, 'https://example.test/api/json/citations.json');
		return Response.json(entries);
	}, 'https://example.test/api');
	assert.equal(result.citationsError, false);
	assert.equal(result.citations.length, entries.length);
});

test('logs fetch, HTTP, JSON, and schema failures and exposes an error state', async (t) => {
	const logger = t.mock.method(console, 'error', () => {});
	/** @type {(typeof fetch)[]} */
	const failures = [
		async () => {
			throw new Error('network');
		},
		async () => new Response('', { status: 503 }),
		async () => new Response('invalid JSON'),
		async () => Response.json({})
	];
	for (const fetcher of failures) {
		assert.deepEqual(await loadCitations(fetcher, 'https://example.test/api'), {
			citations: [],
			citationsError: true
		});
	}
	assert.equal(logger.mock.callCount(), failures.length);
});
