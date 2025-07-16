<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);
	let { classes } = $props();

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		const mode = localStorage.getItem('mode') || 'light';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<Switch
	compact
	{classes}
	{checked}
	name="darkmodeToggle"
	controlActive="bg-surface-500"
	{onCheckedChange}
>
	{#snippet inactiveChild()}<i class="fa-solid fa-moon"></i>{/snippet}
	{#snippet activeChild()}<i class="fa-regular fa-sun"></i>{/snippet}
</Switch>
