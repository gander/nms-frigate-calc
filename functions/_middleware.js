export async function onRequest(context) {
    const response = await context.next();

    if (response.headers.get("Content-Type")?.includes("text/html")) {
        return await handleNonceResponse(response);
    }

    return response;
}

async function handleNonceResponse(response) {
    const nonce = generateNonce();

    let newHeaders = new Headers(response.headers);
    newHeaders.set('Reporting-Endpoints', 'csp-endpoint="https://csp.gander.tools/"')
    newHeaders.set('Content-Security-Policy', `default-src 'self'; script-src https: 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic' https://static.cloudflareinsights.com/beacon.min.js; object-src 'none'; base-uri 'none'; connect-src https://cloudflareinsights.com/ https://medama.gander.tools/ https://sentry.gander.tools/; style-src 'nonce-${nonce}'; require-trusted-types-for 'script'; report-to csp-endpoint; report-uri https://csp.gander.tools/`);

    let body = await response.text();
    body = body.replace(/{{CSP-NONCE}}/g, nonce);

    return new Response(body, {
        headers: newHeaders,
        status: response.status,
        statusText: response.statusText,
    });

}

function generateNonce() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
