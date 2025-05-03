import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	base: '/contact_list_js/',
	server: {
		port: 3000,
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use '../../styles/scss/variables' as *;`
			}
		}
	},
	resolve: {
		alias: {
			'@assets': path.resolve('assets'),
			'@src': path.resolve('src'),
		}
	}
});