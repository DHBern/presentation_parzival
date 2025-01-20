<script>
	import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables';
	import { base } from '$app/paths';
	let { searchResults } = $props();
	const table = new TableHandler(searchResults, { rowsPerPage: 100 });
</script>

<Datatable {table}>
	<table>
		<thead>
			<tr>
				<ThSort {table} field="humanReadableSigil">Sigle</ThSort>
				<ThSort {table} field="d">Dreißiger</ThSort>
				<ThSort {table} field="verse">Vers</ThSort>
				<ThSort {table} field="content">Inhalt</ThSort>
			</tr>
			<tr>
				<ThFilter {table} field="humanReadableSigil" />
				<ThFilter {table} field="d" />
				<ThFilter {table} field="verse" />
				<ThFilter {table} field="content" />
			</tr>
		</thead>
		<tbody>
			{#each table?.rows as row}
				<tr>
					<td>{row?.humanReadableSigil}</td>
					<td>{row?.d}</td>
					<td>{row?.verse}</td>
					<td
						><a href={`${base}/textzeugen/${row.humanReadableSigil}/${row.d}/${row.verse}`}
							>{row?.content}</a
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</Datatable>
