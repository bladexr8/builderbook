import 'isomorphic-fetch';

const port = process.env.port || 8000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

export default async function sendRequest(path, opts = {}) {

    // define headers
    const headers = Object.assign({}, opts.headers || {}, {
        'Content-type': 'application/json; charset=UTF-8',
    });

    console.log('[sendRequest.js] Fetching Book List...');
    console.log(`[sendRequest.js] Fetching URL ${ROOT_URL}${path}`);
    console.log(`[sendRequest.js] opts = ${opts}`);
    console.log(`[sendRequest.js] headers = ${headers}`);

    const response = await fetch(
        `${ROOT_URL}${path}`,
        Object.assign({ method: 'POST', credentials: 'include' }, opts, { headers }),
    );

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    return data;
}