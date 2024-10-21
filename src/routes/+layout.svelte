<script>
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import {
		AppShell,
		AppBar,
		getDrawerStore,
		Drawer,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// Scroll to top on page change (is needed because of skeleton app shell)
	afterNavigate((/** @type import('@sveltejs/kit').AfterNavigate */ params) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	initializeStores();
	const drawerStore = getDrawerStore();

	let classesActive = $derived((/** @type {string} */ href) =>
		base + href === `/${$page.url.pathname.split('/')[1]}`
			? 'bg-primary-500 hover:text-primary-400 text-secondary-500'
			: 'hover:text-primary-500');

	function drawerOpen() {
		const /** @type {import('@skeletonlabs/skeleton').DrawerSettings} */ s = {
				id: 'topnav',
				position: 'top'
			};
		drawerStore.open(s);
	}

	const pages = [
		{ slug: 'Einführung', path: '/einfuehrung' },
		{ slug: 'English Presentation', path: '/englishpresentation' },
		{ slug: 'Handschriftenverzeichnis', path: '/hsverz' },
		{ slug: 'Mitarbeitende', path: '/mitarbeitende' },
		{ slug: 'Projektpräsentationen', path: '/projektpraesentationen' },
		{ slug: 'Fassungen', path: '/fassungen' },
		{ slug: 'Monotext', path: '/monotext' },
		{ slug: 'Suche', path: '/suche' },
		{ slug: 'Versindizes', path: '/versindizes' }
	];
</script>

<Drawer height="h-auto">
	<nav class="list-nav">
		<ul>
			{#each pages as page}
				<li>
					<a href={`${base}${page.path}`}>
						<span class="flex-auto">{page.slug}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</Drawer>

<AppShell>
	{#snippet header()}
	
			<AppBar>
				{#snippet lead()}
					
						<a class="text-xl uppercase font-bold" href={`${base}/`}>Parzival</a>
					
					{/snippet}
				<nav class="flex-none items-center h-full hidden lg:flex">
					{#each pages as page}
						<a
							href={`${base}${page.path}`}
							class="list-nav-item h-full p-4 {classesActive(page.path)}">{page.slug}</a
						>
					{/each}
				</nav>
				{#snippet trail()}
					
						<button class="lg:!hidden btn-icon" onclick={drawerOpen}>
							<i class="fa-solid fa-bars"></i>
						</button>
					
					{/snippet}
			</AppBar>
		
	{/snippet}
	<!-- Page Route Content -->
	<div class="px-4">
		{@render children?.()}
	</div>
</AppShell>
