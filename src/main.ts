import {createApp} from 'vue';
import 'bootstrap/scss/bootstrap.scss';
import App from './App.vue';
import * as Sentry from '@sentry/vue';
import {H} from 'highlight.run';

H.init('ng2zo5pg', {
    environment: 'production',
    networkRecording: {
        enabled: true,
        recordHeadersAndBody: true,
    },
});

const app = createApp(App);

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: [
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
            Sentry.feedbackIntegration({
                buttonLabel: 'Send Feedback',
                formTitle: 'Send Feedback',
                submitButtonLabel: 'Send',
                successMessageText: 'Thank you for your feedback!',
            }),
        ],
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event) {
            if (event.exception && event.event_id) {
                Sentry.showReportDialog({eventId: event.event_id});
            }
            return event;
        },
        release: import.meta.env.VITE_APP_VERSION,
        dist: import.meta.env.VITE_COMMIT_SHA,
    });
}

app.mount('#app');
