import {createApp} from 'vue';
import 'bootstrap/scss/bootstrap.scss';
import App from './App.vue';
import * as Sentry from '@sentry/vue';

const app = createApp(App);

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        tunnel: '/bugs-tunnel',
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: [
            Sentry.replayIntegration(),
            Sentry.feedbackIntegration({
                showName: false,
                showEmail: false,
                buttonLabel: 'Send Feedback',
                formTitle: 'Send Feedback',
                submitButtonLabel: 'Send',
                successMessageText: 'Thank you for your feedback!',
                // @ts-ignore
                onFormOpen: () => umami?.track('Feedback Open'),
                // @ts-ignore
                onSubmitSuccess: () => umami?.track('Feedback Send'),
                // @ts-ignore
                onSubmitError: () => umami?.track('Feedback Error'),
            }),
        ],
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event) {
            if (event.exception && event.event_id) {
                Sentry.showReportDialog({ eventId: event.event_id });
            }
            return event;
        },

    });
}

app.mount('#app');
