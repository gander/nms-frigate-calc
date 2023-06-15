import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

process.env.VITE_APP_VERSION = process.env.npm_package_version;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
});
