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
		table.createFilter('sigil', caseSensitiveCheck),
		table.createFilter('d'),
		table.createFilter('verse'),
		table.createFilter('content')
	];
</script>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<ThSort {table} field="sigil">Sigle</ThSort>
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
					<td class="table-cell-fit">{@html row?.sigil}</td>
					<td class="table-cell-fit">{row?.d}</td>
					<td class="table-cell-fit">{row?.verse}</td>
					<td class="content">
						{#if korpus === 'textzeugen'}
							<a href={`${base}/textzeugen/${row.sigil}/${row.d}/${row.verse}`}>
								{@html row?.content_all}
							</a>
						{:else}
							<a href={`${base}/fassungen/${row.d}`}>
								{@html row?.content_all}
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
				class:preset-filled-primary-500={page === table.currentPage}
				class="btn preset-filled"
				onclick={() => table.setPage(page)}
			>
				{page}
			</button>
		{:else}
			<div class="btn preset-filled-surface-500">...</div>
		{/if}
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.content :global(span) {
		@apply text-surface-400;
	}
</style>
