<script>
	import { Link } from '@lucide/svelte';
	let { hoveredH2 = $bindable(), id, classes="", children } = $props();
</script>

<h2
	{id}
	class={classes}
	onmouseenter={() => {
		hoveredH2.value = id;
	}}
	onmouseleave={() => {
		hoveredH2.value = null;
	}}
>
	{@render children()}
	{#if hoveredH2.value == id}
		<a href={`#${id}`} class="inline-block"><Link /></a>
	{/if}
</h2>
