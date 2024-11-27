import {createApp} from 'vue';
import 'bootstrap/scss/bootstrap.scss';
import App from './App.vue';
import * as Sentry from '@sentry/vue';

const app = createApp(App);

if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.browserProfilingIntegration(),
            Sentry.captureConsoleIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                maskAllInputs: false,
                blockAllMedia: false,
            }),
        ],
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
    });
}

app.mount('#app');
