import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import HtmlPlugin, {ScriptTag} from 'vite-plugin-html-config';
import {VitePWA} from 'vite-plugin-pwa';

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

    const pwaOptions = {
        includeAssets: ['favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'robots.txt'],
        manifest: {
            id: 'dev.gander.nms-frigate-calc',
            name: 'No Man\'s Sky Frigate Calculator',
            short_name: 'NMS Frigate Calc',
            description: 'A calculator to check the profitability of buying a frigate ship in No Man\'s Sky game.',
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
        plugins: [
            vue(),
            HtmlPlugin({headScripts}),
            VitePWA(pwaOptions),
        ],
    };
});
