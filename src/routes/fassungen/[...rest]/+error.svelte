<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';

	let gotoThirties = $state(1);
</script>

<h2 class="h2 pb-6">{page.error.message}</h2>
<a class="anchor" href="{base}/fassungen/1">Zum ersten Dreißiger</a>
<form>
	<label for="goto-thirties" class="block text-lg font-bold font-serif mb-2"
		>Zu Dreißiger springen</label
	>
	<input
		id="goto-thirties"
		type="number"
		placeholder="Dreißiger"
		class="input inline max-w-28"
		min="1"
		max={NUMBER_OF_PAGES}
		bind:value={gotoThirties}
	/>
	<a
		href="{base}/fassungen/{gotoThirties}"
		aria-label="suchen"
		class="btn preset-filled-primary-500">Anzeigen</a
	>
</form>
