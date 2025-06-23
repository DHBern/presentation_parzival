<script>
	import { Link } from '@lucide/svelte';
	let { id, classes="", children } = $props();
	let isHovered = $state(false);
</script>

<h2
	{id}
	class={classes}
	onmouseenter={() => {
		isHovered = true;
	}}
	onmouseleave={() => {
		isHovered = false;
	}}
>
	{@render children()}
	{#if isHovered}
		<a href={`#${id}`} class="inline-block"><Link /></a>
	{/if}
</h2>
