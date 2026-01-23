import { goto } from '$app/navigation';
import { base } from '$app/paths';

/**
 * @param {boolean} isSync
 * @param {Element} scrollContainer
 * @param {{ data: { thirties: any; }; }} page
 */
export default function createObserver(isSync, scrollContainer, page, activeThirties = null) {
	let lastScrollY = 0;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let debounceTimeout;
	return new IntersectionObserver(
		(entries) => {
			clearTimeout(debounceTimeout);
			// Detect scroll direction
			const currentScrollY = scrollContainer?.scrollTop || 0;
			const scrolledDown = currentScrollY > lastScrollY;
			lastScrollY = currentScrollY;

			debounceTimeout = setTimeout(() => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (isSync) {
							let verse;
							if (scrolledDown) {
								verse = entry.target.nextElementSibling
									?.querySelector(`[data-verse]`)
									?.attributes['data-verse']?.value.split('.')[0];
							} else {
								verse = entry.target.previousElementSibling
									?.querySelector(`[data-verse]`)
									?.attributes['data-verse']?.value.split('.')[0];
							}
							if (entry.target && verse && verse !== page.data.thirties) {
								goto(`${base}/fassungen/${verse}`, {
									noScroll: true,
									keepFocus: true,
									replaceState: true
								});
							}
						} else {
							let verse = entry.target
								.querySelector(`[data-verse]`)
								?.attributes['data-verse']?.value.split('.')[0];
							if (entry.target && verse && verse !== page.data.thirties) {
								if (activeThirties) {
									activeThirties.value = verse;
								}
								goto(`${base}/fassungen/${verse}`, {
									noScroll: true,
									keepFocus: true,
									replaceState: true
								});
							}
						}
					}
				});
			}, 100); // Adjust the debounce delay as needed}, 100); // Adjust the debounce delay as needed
		},
		{
			root: scrollContainer,
			rootMargin: '-13%',
			threshold: [0, 1]
		}
	);
}
