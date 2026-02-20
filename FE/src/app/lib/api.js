const stripTrailing = (s = '') => s.replace(/\/+$/, '')
const stripLeading = (s = '') => s.replace(/^\/+/, '')

const BASE_URL = stripTrailing(process.env.NEXT_PUBLIC_API_BASE_URL || '')

function buildUrl(path = ''){
    if(!BASE_URL) return path;
    return `${BASE_URL}/${stripLeading(String(path))}`;
}

async function apiFetch(
    path,
    { method = 'GET', token, body, headers, cache = 'no-store', revalidate = 0 } = {}
) {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const isBrowser = typeof window !== 'undefined';

    const init = {
        method,
        headers: {
            ...(isForm ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: token.startsWith?.('Bearer ') ? token : `Bearer ${token}` } : {}),
            ...headers
        },
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
        ...(isBrowser ? { credential: 'include' } : {}),
        cache,
        next : { revalidate }
    }
    const response = await fetch(buildUrl(path), init);

    let data;
    try{
        data = await response.json()     
    } catch(e) {
        console.error("Error Fetching API:", e);
        data = {}
    }

    if(!response.ok){
        const message = data?.message || `HTTP ${response.status}`
        const err = new Error(message)

        err.response = {data, status: response.status}
        throw err
    }
    return data
}

export const api = {
    get: (path, options) => apiFetch(path, { ...options, method: 'GET' }),
    post: (path, body, options) => apiFetch(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => apiFetch(path, { ...options, method: 'PUT', body }),
    patch: (path, body, options) => apiFetch(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => apiFetch(path, { ...options, method: 'DELETE' }),
}