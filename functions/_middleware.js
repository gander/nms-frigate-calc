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
    newHeaders.set('Content-Security-Policy-Report-Only', `script-src https: http: 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; style-src 'nonce-${nonce}'; require-trusted-types-for 'script'; report-uri https://sentry.gander.tools/api/7/security/?sentry_key=6a9fe9561e987be60e05e9acdb5a770a`);

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
