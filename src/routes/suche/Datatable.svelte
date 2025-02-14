<script>
	import { TableHandler, ThSort } from '@vincjo/datatables';
	import { base } from '$app/paths';
	let { searchResults, korpus } = $props();
	const table = new TableHandler(searchResults, { rowsPerPage: 100 });

	/**
	 * @type {import('@vincjo/datatables').Check}
	 */
	const caseSensitiveCheck = (entry, value) => {
		return String(entry).startsWith(String(value));
	};
	let filter = [
		table.createFilter('humanReadableSigil', caseSensitiveCheck),
		table.createFilter('d'),
		table.createFilter('verse'),
		table.createFilter('content')
	];
</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<ThSort {table} field="humanReadableSigil">Sigle</ThSort>
				<ThSort {table} field={(r) => Number(r.d)}>Dreißiger</ThSort>
				<ThSort {table} field={(r) => Number(r.verse)}>Vers</ThSort>
				<ThSort {table} field="content">Inhalt</ThSort>
			</tr>
			<tr>
				{#each filter as f}
					<th class="py-1">
						<input
							placeholder="Filter..."
							class="input p-0.5"
							type="text"
							bind:value={f.value}
							oninput={() => f.set()}
						/>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each table?.rows as row (row.id)}
				<tr>
					<td class="table-cell-fit">{row?.humanReadableSigil}</td>
					<td class="table-cell-fit">{row?.d}</td>
					<td class="table-cell-fit">{row?.verse}</td>
					<td>
						{#if korpus === 'textzeugen'}
							<a href={`${base}/textzeugen/${row.sigla}/${row.d}/${row.verse}`}>
								{@html row?.content}
							</a>
						{:else}
							<a href={`${base}/fassungen/${row.d}`}>
								{@html row?.content}
							</a>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="flex space-x-1 my-4">
	{#each table.pagesWithEllipsis as page}
		{#if page}
			<button
				type="button"
				class:variant-filled-primary={page === table.currentPage}
				class="btn variant-filled"
				onclick={() => table.setPage(page)}
			>
				{page}
			</button>
		{:else}
			<div class="btn variant-filled-surface">...</div>
		{/if}
	{/each}
</div>
