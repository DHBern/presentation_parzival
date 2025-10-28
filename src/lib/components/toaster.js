import { createToaster } from '@skeletonlabs/skeleton-svelte';

export const toaster = createToaster({ max: 33, overlap: true, pauseOnPageIdle: true });
