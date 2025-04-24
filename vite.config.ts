import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
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