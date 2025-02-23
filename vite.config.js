import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/ftp': {  // Proxy any requests starting with '/ftp'
                target: 'https://senegal.marvin.vito.be',
                changeOrigin: true,
                //  Optional:  If you need to rewrite the path, you can add a rewrite rule:
                // rewrite: (path) => path.replace(/^\/ftp/, '') // Removes /ftp from the request path
            }
        }
    }
});