// Recompiles all parzival* ODDs by re-saving them through the TEI Publisher API.
// The POST /api/odd recompile endpoint is broken, so we instead GET each ODD and
// PUT it back, which regenerates the derivative XQuery transforms.

const BASE = 'http://localhost:8081/exist/apps/parzival/api';
const AUTH = 'Basic ' + Buffer.from('tei:simple').toString('base64');
const OUTPUT_PREFIX = 'transform';

async function main() {
	const listResponse = await fetch(`${BASE}/odd`);
	if (!listResponse.ok) {
		throw new Error(`Failed to list ODDs: ${listResponse.status} ${listResponse.statusText}`);
	}

	const odds = (await listResponse.json()).filter((odd) => odd.name.startsWith('parzival'));
	console.log(`Found ${odds.length} parzival* ODD(s) to recompile.`);

	for (const odd of odds) {
		const fileName = odd.path.slice(odd.path.lastIndexOf('/') + 1);
		const collection = odd.path.slice(0, odd.path.lastIndexOf('/'));

		console.log(`\nRecompiling ${fileName} ...`);

		const getResponse = await fetch(`${BASE}/odd/${fileName}`, {
			method: 'GET',
			headers: {
				Accept: 'application/xml'
			}
		});
		if (!getResponse.ok) {
			console.error(`  GET failed: ${getResponse.status} ${getResponse.statusText}`);
			process.exitCode = 1;
			continue;
		}
		const xml = await getResponse.text();

		const query = new URLSearchParams({
			root: collection,
			'output-root': collection,
			'output-prefix': OUTPUT_PREFIX
		});

		const putResponse = await fetch(`${BASE}/odd/${fileName}?${query}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/xml',
				Authorization: AUTH
			},
			body: xml
		});

		if (!putResponse.ok) {
			console.error(`  PUT failed: ${putResponse.status} ${putResponse.statusText}`);
			console.error(`  ${await putResponse.text()}`);
			process.exitCode = 1;
			continue;
		}

		const result = await putResponse.json();
		console.log(`  Saved to ${result.path ?? collection}`);
		if (result.report) {
			console.log(`  ${result.report}`);
		}

		// Wait a bit to avoid overwhelming the server
		await new Promise((resolve) => setTimeout(resolve, 10000));
	}

	console.log('\nDone.');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
