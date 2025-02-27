import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from '@sveltejs/vite-plugin-svelte'; // CHANGED: Import the default export

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: sveltePreprocess(), // CHANGED: Use the default export

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