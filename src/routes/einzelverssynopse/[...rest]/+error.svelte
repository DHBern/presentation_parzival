<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import VerseSelector from '$lib/components/VerseSelector.svelte';
</script>

<h2 class="h2 pb-6">{page.error.message}</h2>
<a class="anchor" href="{base}/einzelverssynopse/1/1">Zum ersten Vers</a>
<VerseSelector targetPath="/einzelverssynopse" />
