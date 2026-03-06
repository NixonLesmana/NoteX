import { api } from "../lib/api";

export async function createNoteApi(payload, token) {
    const response = await api.post('/api/v1/notes/', payload, { token });
    return response?.data ?? response;
}

export async function fetchPublicNotesApi({
    page = 1,
    perPage = 12,
    q='',
    sort='created_at',
    order='desc',
} = {}) {
    const params = new URLSearchParams(
        {
            page: String(page), 
            per_page: String(perPage),
            sort,
            order
        }
    )
    if (q) params.set('q', q);

    const response = await api.get(`/api/v1/notes/?${params.toString()}`);
    const data = response?.data ?? response;

    return {
        items: data ?? [],
        meta: data ?? { page: 1, per_page: 12, total: 0, pages: 1 }
    }
}

export async function fetchMyNotesApi({
    page = 1,
    perPage = 12,
    q='',
    sort='created_at',
    order='desc',
} = {}, token) {
    const params = new URLSearchParams(
        {
            page: String(page), 
            per_page: String(perPage),
            sort,
            order
        }
    )
    if (q) params.set('q', q);

    const response = await api.get(`/api/v1/notes/me?${params.toString()}`, { token });
    const data = response?.data ?? response;
    return{
        items: data ?? [],
        meta: data ?? { page: 1, per_page: 12, total: 0, pages: 1 }
    }
}

export async function updateNoteApi(id, payload, token) {
    const response = await api.put(`/api/v1/notes/${id}`, payload, { token });
    return response?.json ?? response;
}

export async function searchNotesApi(q, token) {
    const params = new URLSearchParams();

    if(q) params.set('q', q);

    const response = await api.get(`/api/v1/notes/?${params.toString()}`, { token });
    const data = response?.data ?? response;
    return Array.isArray(data) ? data : data.items ?? [];

}

export async function getNoteBySlugApi(slug, { token, password } = {}) {
    const url = `/api/v1/notes/${encodeURIComponent(slug)}` + (password ? `?password=${encodeURIComponent(password)}` : '')

    const response = await api.get(url, {
        token
    })

    const data = response.data ?? response
    return data
}