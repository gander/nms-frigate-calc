import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import HtmlPlugin, {IHTMLTag, ScriptTag} from 'vite-plugin-html-config';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;
    process.env.VITE_COMMIT_SHA = process.env.CF_PAGES_COMMIT_SHA;

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

    const metas: IHTMLTag[] = [{
        'http-equiv': 'Content-Security-Policy',
        'content': `default-src 'self'; img-src * data: blob:; media-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sentry.gander.tools/ https://browser.sentry-cdn.com/ https://medama.gander.tools/; style-src 'self' 'unsafe-inline'; frame-src 'self'; connect-src 'self' blob: https://sentry.gander.tools/api/ https://medama.gander.tools/api/; font-src 'self'; worker-src 'self' blob:`
    }];

    return {
        plugins: [
            vue(),
            HtmlPlugin({headScripts, metas}),
        ],
    };
});
