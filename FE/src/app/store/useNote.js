import { create } from "zustand";
import { createNoteApi, fetchPublicNotesApi } from "../services/noteService";
import { useAuth } from "./useAuth";

export const useNote = create((set, get) => ({
    items: [],
    meta: {page: 1, per_page: 12, total: 0, pages: 1},
    myItems: [],
    myMeta: { page: 1, per_page: 12, total: 0, pages: 1},
    loading: false,

    async createNote(payload) {
        const auth = useAuth.getState() || {};
        let token = auth.token || "";

        if(!token) throw new Error("No token found, please login first.");
        if(token.startsWith("Bearer ")) token = token.slice(7);

        const response = await createNoteApi(payload, token);

        const myItems = get().myItems || [];
        set({ myItems: [response, ...myItems] });

        if (response?.status === "public") {
            const items = get().items || [];
            set({ items: [response, ...items] });
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("note:created", { detail: note }));
        }

        return response
    },

    async loadPublic(params = {}) {
        set({ loading: true })
        try {
            const { items, meta } = await fetchPublicNotesApi(params)
            set({ items, meta, loading: false })
            return { success: true }

        } catch (error) { 
            set ({ loading: false })
            return { success: false, error: error.message }
        }
    }
}))