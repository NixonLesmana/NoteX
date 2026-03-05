import { api } from '../lib/api';

export async function registerApi(payload) {
    return api.post("/api/v1/register/", payload);
}

export async function loginApi(payload) {
    return api.post("/api/v1/login/", payload);
}

export async function getProfileApi(token) {
    return api.get("/api/v1/user/", { token });
}

export async function updateUserApi(payload, token) {
    return api.put("/api/v1/user/", payload, { token });
}