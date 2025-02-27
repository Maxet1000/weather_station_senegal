import adapter from '@sveltejs/adapter-cloudflare';
import pkg from 'svelte-preprocess';
const { vitePreprocess } = pkg;

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
