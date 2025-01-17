<script>
	import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables';
	let { searchResults } = $props();
	const table = new TableHandler(searchResults, { rowsPerPage: 100 });
	$effect(() => {
		table.setRows(searchResults);
	});
</script>

<Datatable {table}>
	<table>
		<thead>
			<tr>
				<ThSort {table} field="sigla">Sigle</ThSort>
				<ThSort {table} field="d">Dreißiger</ThSort>
				<ThSort {table} field="verse">Vers</ThSort>
				<ThSort {table} field="content">Inhalt</ThSort>
			</tr>
			<tr>
				<ThFilter {table} field="sigla" />
				<ThFilter {table} field="d" />
				<ThFilter {table} field="verse" />
				<ThFilter {table} field="content" />
			</tr>
		</thead>
		<tbody>
			{#each table?.rows as row}
				<tr>
					<td>{row?.sigla}</td>
					<td>{row?.d}</td>
					<td>{row?.verse}</td>
					<td>{row?.content}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Datatable>
