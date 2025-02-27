import adapter from '@sveltejs/adapter-cloudflare'; // Import directly
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // See below for options, add them here
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    }),
    output: {
      dir: 'build' // Not needed here. adapter-cloudflare controls this.
    }

  }
};

export default config;