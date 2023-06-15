import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import htmlPlugin from 'vite-plugin-html-config';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;

    const plugins = [vue()];

    if (command === 'build') {
        if (process.env.VITE_UMAMI_ID && process.env.VITE_UMAMI_SRC) {
            plugins.push(htmlPlugin({
                headScripts: [{
                    'async': true,
                    'data-website-id': process.env.VITE_UMAMI_ID,
                    'src': process.env.VITE_UMAMI_SRC,
                }],
            }));
        }
    }

    return {plugins};
});
