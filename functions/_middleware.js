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
    newHeaders.set('Content-Security-Policy-Report-Only', `'nonce-${nonce}'; style-src 'nonce-${nonce}';`);

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
