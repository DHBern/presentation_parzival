import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { isHttpError, isRedirect } from '@sveltejs/kit';
import { createServer } from 'vite';

let server;
let GET;
let load;

before(async () => {
	server = await createServer({
		configFile: false,
		optimizeDeps: { noDiscovery: true },
		server: { middlewareMode: true },
		plugins: [
			{
				name: 'redirect-fixtures',
				resolveId(id) {
					if (id === '$app/paths') return '\0$app/paths';
					if (id === '$lib/data/metadata') return '\0$lib/data/metadata';
					if (id.startsWith('$lib/')) {
						return fileURLToPath(new URL(`../src/lib/${id.slice(5)}.js`, import.meta.url));
					}
				},
				load(id) {
					if (id === '\0$app/paths') return "export const base = '/edition';";
					if (id === '\0$lib/data/metadata') {
						return 'export const metadata = Promise.resolve({ codices: [], fragments: [] });';
					}
				}
			}
		]
	});
	({ GET } = await server.ssrLoadModule(
		fileURLToPath(
			new URL('../src/routes/transkriptionen/[[sigla=handles]]/+server.js', import.meta.url)
		)
	));
	({ load } = await server.ssrLoadModule(
		fileURLToPath(
			new URL(
				'../src/routes/transkriptionen/[[sigla=handles]]/[[thirties=thirties]]/[[verse]]/+page.js',
				import.meta.url
			)
		)
	));
});

after(async () => {
	await server?.close();
});

function request(sigla, data, search = '', handler = GET) {
	return handler({
		params: { sigla },
		url: new URL(`https://example.test/transkriptionen/${sigla ?? ''}${search}`),
		fetch: async (url) => {
			const handle = /\/([^/]+)\.json$/.exec(url)[1];
			return data[handle] ?? new Response(null, { status: 404 });
		}
	});
}

function pages(handle, lines) {
	return Response.json({ [handle]: lines.map((l) => ({ l })) });
}

test('redirects to the numerically earliest available verse, preserving its identifier and query', async () => {
	await assert.rejects(
		request(
			'fr18',
			{ fr18: pages('fr18', [[], ['464.01', '463.20'], ['463.09-01']]) },
			'?view=page'
		),
		(error) =>
			isRedirect(error, 308) &&
			error.location === '/edition/transkriptionen/fr18/463/09-01?view=page'
	);
});

test('redirects to the numerically earliest verse common to all witnesses', async () => {
	await assert.rejects(
		request('fr18-g-w', {
			fr18: pages('fr18', [
				['463.20', '464.01'],
				['463.21', '463.22']
			]),
			g: pages('g', [['1.01-0', '463.20', '463.22', '463.21']]),
			w: pages('w', [['463.22', '464.01'], ['463.21']])
		}),
		(error) =>
			isRedirect(error, 308) && error.location === '/edition/transkriptionen/fr18-g-w/463/21'
	);
});

test('requires exact verse identifiers and preserves shared suffixes', async () => {
	await assert.rejects(
		request('g-w', {
			g: pages('g', [['1.01-0', '1.01', '1.02-01']]),
			w: pages('w', [['1.01-1', '1.02-01']])
		}),
		(error) => isRedirect(error, 308) && error.location === '/edition/transkriptionen/g-w/1/02-01'
	);
});

test('redirects client-side page loads to a common verse, preserving the query', async () => {
	await assert.rejects(
		request(
			'fr18-g',
			{ fr18: pages('fr18', [['463.20', '463.21']]), g: pages('g', [['1.01', '463.21']]) },
			'?view=page',
			load
		),
		(error) =>
			isRedirect(error, 308) &&
			error.location === '/edition/transkriptionen/fr18-g/463/21?view=page'
	);
});

test('still selects a verse when a section is specified without one', async () => {
	const result = await load({
		params: { sigla: 'fr18', thirties: '463' },
		url: new URL('https://example.test/transkriptionen/fr18/463'),
		fetch: async (url) => {
			if (url.endsWith('contiguous_ranges.json')) {
				return Response.json({ 'contiguous-ranges': [] });
			}
			if (url.endsWith('metadata-ms-page/fr18.json')) {
				return Response.json({ fr18: [{ id: 'fr18001r', l: ['463.20', '463.21'] }] });
			}
			return Response.json({});
		}
	});

	assert.equal(result.thirties, '463');
	assert.equal(result.verse, '20');
	assert.equal((await result.content[0].meta)[0].id, 'fr18001r');
});

test('returns a 404 when no witness or no verse is available', async () => {
	await assert.rejects(request(undefined, {}), (error) => isHttpError(error, 404));
	await assert.rejects(request('fr18', { fr18: pages('fr18', [[], ['not-a-verse']]) }), (error) =>
		isHttpError(error, 404)
	);
});

test('returns a 404 when witnesses have no verse in common', async () => {
	await assert.rejects(
		request('fr18-g', {
			fr18: pages('fr18', [['463.20']]),
			g: pages('g', [['1.01']])
		}),
		(error) => isHttpError(error, 404) && error.body.message === 'No common verses found for fr18-g'
	);
});

test('reports missing or invalid metadata instead of redirecting to a guessed verse', async () => {
	await assert.rejects(request('fr18', {}), (error) => isHttpError(error, 502));
	await assert.rejects(request('fr18', { fr18: Response.json({ fr18: null }) }), (error) =>
		isHttpError(error, 502)
	);
});
