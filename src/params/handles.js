import { metadata } from '$lib/data/metadata';
const possibleHandles = [
	...(await metadata).codices.map((c) => c.handle),
	...(await metadata).fragments.map((f) => f.handle)
];

/**
 * @param {string} param
 * @return {boolean}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export const match = (param) => {
	return param.split('-').some((v) => possibleHandles.includes(v));
};
