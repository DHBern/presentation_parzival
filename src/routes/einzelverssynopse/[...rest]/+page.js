import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
	error(
		404,
		`Der Vers ${params.rest.replaceAll('/', '.')} liegt außerhalb des gültigen Bereiches 1.1 bis 827.30`
	);
};
export const prerender = false;
