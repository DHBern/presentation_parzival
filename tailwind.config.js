import { join } from 'path';

import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import { parzival } from './parzival';
import { skeleton } from '@skeletonlabs/tw-plugin';
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	plugins: [typography, containerQueries, forms]
};
