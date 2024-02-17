import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$src: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
			$stores: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'stores'),
			$components: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'components'),
			$tools: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'tools')
		}
	},
	define: {
		'process.env.ANCHOR_BROWSER': true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
