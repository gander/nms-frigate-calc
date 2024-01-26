export async function onRequestPost({request}) {
    const [header, body] = request.body.tee();
    let decoder = new TextDecoder();
    let chunk = '';
    const headerReader = header.getReader();
    while (true) {
        const {done, value} = await headerReader.read();
        if (done) break;
        chunk += decoder.decode(value);
        const index = chunk.indexOf('\n');
        if (index >= 0) {
            const line = chunk.slice(0, index);
            const dsn = new URL(JSON.parse(line).dsn);
            const headers = request.headers;
            headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'));
            return fetch(`https://${dsn.host}/api${dsn.pathname}/envelope/`, {
                method: 'POST', body, headers,
            });
        }
    }
    return new Response(null, {status: 404});
}
