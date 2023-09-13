import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import htmlPlugin from 'vite-plugin-html-config';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
    process.env.VITE_APP_VERSION = process.env.npm_package_version;

    const plugins = [vue(), VitePWA({
        includeAssets: ['favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'robots.txt'],
        manifest: {
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
                    src: 'android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                },
                {
                    src: 'android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                },
            ]
        },
        devOptions: {
            enabled: true
        }
    })];

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
