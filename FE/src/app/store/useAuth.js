"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginApi, registerApi } from "../services/authService";

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
        })
    )
)