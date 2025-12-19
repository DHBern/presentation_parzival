import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
	error(
		404,
		`Dreißiger ${params.rest} liegt außerhalb des gültigen Bereiches 1 bis 827 oder ist ungültig.`
	);
};

export const prerender = false;
