import adapter from '@sveltejs/adapter-cloudflare';
import { preprocess } from '@sveltejs/vite-plugin-svelte';  // CHANGED THIS LINE

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(), // CHANGED THIS LINE

	kit: {
		adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        })
	}
};

export default config;