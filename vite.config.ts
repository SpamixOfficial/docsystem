import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
	plugins: [sveltekit()],
    define: {
		__VERSION__: `"${packageJson.version}"`,
	},
});
