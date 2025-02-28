import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/ftp': {
                target: 'https://senegal.marvin.vito.be',
                changeOrigin: true,
            }
        }
    },
    build: { // Add this build section
        outDir: 'build' // Explicitly set the output directory to 'build'
    }
});