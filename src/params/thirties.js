/**
 * @param {string} param
 * @return {boolean}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export const match = (param) => {
	return Number(param) >= 1 && Number(param) <= 827;
};
