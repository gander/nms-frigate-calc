import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import HtmlPlugin, {ScriptTag} from 'vite-plugin-html-config';
import {VitePWA} from 'vite-plugin-pwa';

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

    const pwaOptions = {
        selfDestroying: true,
        includeAssets: ['favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'robots.txt'],
        manifest: {
            id: 'tools.gander.nms',
            name: 'No Man\'s Sky Gander Tools',
            short_name: 'NMS Gander Tools',
            description: 'A tools with calculator to check the profitability of buying a frigate ship in No Man\'s Sky game.',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: 'android-chrome-512x512-maskable.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                },
                {
                    src: 'android-chrome-512x512-maskable.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                },
            ],
        },
        devOptions: {
            enabled: true,
        },
    };

    return {
        html: {
            cspNonce: '{{CSP-NONCE}}',
        },
        plugins: [
            vue(),
            HtmlPlugin({headScripts}),
            VitePWA(pwaOptions),
        ],
    };
});
