import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from 'svelte-preprocess'; // Correct import

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess()],
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
