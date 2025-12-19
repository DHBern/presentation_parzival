import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
	error(404, params.rest);
};

export const prerender = false;
