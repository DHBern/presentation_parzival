/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		thirties: params.thirties
	};
}

export const prerender = false;
