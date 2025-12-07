import { metadata } from '$lib/data/metadata';
const possibleHandles = (await metadata).codices.map((c) => c.handle);

/**
 * @param {string} param
 * @return {boolean}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export const match = (param) => {
	return possibleHandles.includes(param);
};
