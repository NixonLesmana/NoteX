"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginApi, registerApi, getProfileApi, updateUserApi } from "../services/authService";

const noStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
}

export const useAuth = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,

            isAuthenticated: () => !!get().token,

            async login({ username, password}) {
                set({ loading: true});

                try {
                    const response = await loginApi({ username, password });
                    const { data } = response;

                    set ({
                        user: {
                            id: data.id,
                            username: data.username,
                            email: data.email,
                        },
                        token: data.token,
                        loading: false,
                    });

                    return { success: true };

                } catch(e) {
                    set({ loading: false });
                    return { success: false, error: e?.message || "Login failed" };
                }
            },

            async register(payload) {
                set({ loading: true });

                try{
                    const response = await registerApi(payload);
                    const { data } = response;
                    set({ loading: false });

                    return { success: true, data };

                } catch(e) {
                    set({ loading: false });
                    return { success: false, error: e?.message || "Registration failed" };
                }
            },

            async checkSession() {
                const { token } = get() || {};
                if(!token) return { success: false, error: "No token found" };

                try {
                    const pure = token.startsWith("Bearer ") ? token.slice(7) : token;

                    const response = await getProfileApi(pure);
                    const { data } = response;

                    set({
                        user: {
                            id: data.id,
                            username: data.username,
                            email: data.email,
                            profile_img: data.profile_img,
                            thumbnail_img: data.thumbnail_img
                        }
                    });
                    return { success: true };

                } catch (error) {
                    set({ user: null, token: null });
                    return { success: false, error: error?.message || "Session check failed" };
                }
            },

            async updateProfile(values = {}, files = {}) {
                const { token } = get() || {};
                if(!token) return { success: false, error: "No token found" };

                const pure = token.startsWith("Bearer ") ? token.slice(7) : token;

                const fd = new FormData();
                ["username", "email", "password"].forEach((key) => {
                    if(values[key]) fd.append(key, values[key]);
                });

                if(files.profile_img) fd.append("profile_img", files.profile_img);
                if(files.thumbnail_img) fd.append("thumbnail_img", files.thumbnail_img);

                const response = await updateUserApi(fd, pure);

                const {data} = response;

                set({
                    user: {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        profile_img: data.profile_img,
                        thumbnail_img: data.thumbnail_img
                    }
                })
                return { success: true, data };
            },

            logout() {
                set({ user: null, token: null });
            }
        })
    )
)