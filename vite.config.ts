import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import HtmlPlugin, {ScriptTag} from 'vite-plugin-html-config';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;

    const headScripts: ScriptTag[] = [];

    if (command === 'build') {
        if (process.env.VITE_UMAMI_ID && process.env.VITE_UMAMI_SRC) {
            headScripts.push({
                'async': true,
                'defer': true,
                'data-website-id': process.env.VITE_UMAMI_ID,
                'src': process.env.VITE_UMAMI_SRC,
            });
        }
        if (process.env.VITE_MEDAMA_SRC) {
            headScripts.push({
                'defer': true,
                'src': process.env.VITE_MEDAMA_SRC,
            });
        }
    }

    return {
        plugins: [
            vue(),
            HtmlPlugin({headScripts}),
        ],
    };
});
