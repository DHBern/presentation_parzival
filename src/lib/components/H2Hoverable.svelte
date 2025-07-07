<script>
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
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
		<a href={`#${id}`} class="inline-block"><i class="fa-solid fa-link"></i></a>
	{/if}
</h2>
