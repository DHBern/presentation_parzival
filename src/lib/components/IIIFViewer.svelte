<script module>
	import { assets } from '$app/paths';
	/**
	 * @type {import('openseadragon')}
	 */
	let OpenSeadragon;
</script>

<script>
	/** @type {{iiif:  Object }} */
	let { iiif } = $props();
	const uuid = crypto.randomUUID();
	/**
	 * @type {import('openseadragon').Viewer}
	 */
	let viewer;

	const generateViewer = (/** @type {Element} */ node, /** @type {Object} */ iiif) => {
		/** @type {ResizeObserver}*/
		let observer;
		const createViewer = () => {
			viewer = new OpenSeadragon.Viewer({
				id: node.id,
				prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
				showNavigator: true,
				sequenceMode: false,
				navImages: {
					zoomIn: {
						REST: 'zoomin_rest.svg',
						GROUP: 'zoomin_grouphover.svg',
						HOVER: 'zoomin_hover.svg',
						DOWN: 'zoomin_pressed.svg'
					},
					next: {
						REST: 'next_rest.svg',
						GROUP: 'next_grouphover.svg',

						HOVER: 'next_hover.svg',
						DOWN: 'next_pressed.svg'
					},
					previous: {
						REST: 'previous_rest.svg',
						GROUP: 'previous_grouphover.svg',
						HOVER: 'previous_hover.svg',
						DOWN: 'previous_pressed.svg'
					},
					fullpage: {
						REST: 'fullpage_rest.svg',
						GROUP: 'fullpage_grouphover.svg',
						HOVER: 'fullpage_hover.svg',
						DOWN: 'fullpage_pressed.svg'
					},
					home: {
						REST: 'home_rest.svg',
						GROUP: 'home_grouphover.svg',
						HOVER: 'home_hover.svg',
						DOWN: 'home_pressed.svg'
					},
					zoomOut: {
						REST: 'zoomout_rest.svg',
						GROUP: 'zoomout_grouphover.svg',
						HOVER: 'zoomout_hover.svg',
						DOWN: 'zoomout_pressed.svg'
					},
					rotateleft: {
						REST: 'rotateleft_rest.svg',
						GROUP: 'rotateleft_grouphover.svg',
						HOVER: 'rotateleft_hover.svg',
						DOWN: 'rotateleft_pressed.svg'
					},
					rotateright: {
						REST: 'rotateright_rest.svg',
						GROUP: 'rotateright_grouphover.svg',
						HOVER: 'rotateright_hover.svg',
						DOWN: 'rotateright_pressed.svg'
					},
					flip: {
						REST: 'flip_rest.svg',
						GROUP: 'flip_grouphover.svg',
						HOVER: 'flip_hover.svg',
						DOWN: 'flip_pressed.svg'
					}
				}
			});
			observer = new ResizeObserver((_entries) => {
				setTimeout(() => {
					viewer.viewport.goHome(false);
				}, 50);
			});
			observer.observe(node);
			if (!iiif) return;
			viewer.open(iiif);
		};
		if (!OpenSeadragon) {
			import('openseadragon').then((r) => {
				OpenSeadragon = r.default;
				createViewer();
			});
		} else {
			createViewer();
		}

		return {
			/**
			 * @param {Promise<Object>} iiif
			 */
			update(iiif) {
				if (!viewer) return;
				viewer.open(iiif);
			},
			destroy() {
				viewer.destroy();
				if (observer) {
					observer.disconnect();
				}
			}
		};
	};
</script>

<div id="viewer-{uuid}" class="w-full h-full" use:generateViewer={$state.snapshot(iiif)}></div>
