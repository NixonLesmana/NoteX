import { create } from "zustand";
import { fetchMyFavoritesApi, fetchMyFavortieIds, toggleLikeApi } from "../services/favoriteService";
import { useAuth } from "./useAuth";

const toKey = (id) => String(id ?? "");

export const useFavorite = create((set, get) => ({
    items: [],
    meta: { page: 1, per_page: 12, total: 0, pages: 1 },
    favoriteIds: new Set(),
    pendingIds: new Set(),
    loading: false,

    has(noteId) {return get().favoriteIds.has(toKey(noteId))},
    isPending(noteId) {return get().pendingIds.has(toKey(noteId))},

    async load(params = {}) {
        set({ loading: true })
        try {
            const auth = useAuth.getState() || {};
            let token = auth.token;
            if(!token) throw new Error("No token found, please login first.");
            if(token.startsWith("Bearer ")) token = token.slice(7);

            const { items, meta } = await fetchMyFavoritesApi(params, token);
            const ids = new Set(items.map(n => toKey(n.id)));
            set({ items, meta, favoriteIds: ids, loading: false });
            return { success: true };

        } catch (error) {
            set({ loading: false });
            return { success: false, error: error.message };
        }
    },

    async loadIds() {
        try {
            const auth = useAuth.getState() || {};
            let token = auth.token;
            if(!token) throw new Error("No token found, please login first.");
            if(token.startsWith("Bearer ")) token = token.slice(7);

            const idsSet = await fetchMyFavortieIds(token);
            const normalized = new Set(Array.from(idsSet, id => toKey(id)));
            set({ favoriteIds: normalized });

        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async toggle(noteId) {
        const auth = useAuth.getState() || {};
        let token = auth.token;
        if(!token) throw new Error("No token found, please login first.");
        if(token.startsWith("Bearer ")) token = token.slice(7);

        const key = toKey(noteId);
        const { favoriteIds, pendingIds } = get();
        const willLike = !favoriteIds.has(key);

        const nextIds = new Set(favoriteIds);
        willLike ? nextIds.add(key) : nextIds.delete(key);

        const nextPending = new Set(pendingIds);
        nextPending.add(key);

        set ({ favoriteIds: nextIds, pendingIds: nextPending });

        try {
            await toggleLikeApi(noteId, token);

            setTimeout(async () => {
                try {
                    const auth2 = useAuth.getState() || {};
                    let token2 = auth2.token;
                    if(!token2) throw new Error("No token found, please login first.");
                    if(token2.startsWith("Bearer ")) token2 = token2.slice(7);

                    const idsSet = await fetchMyFavortieIds(token2);
                    const normalized = new Set(Array.from(idsSet, id => toKey(id)));
                    set({ favoriteIds: normalized });
        
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }, 300);

            return willLike;

        } catch (error) {
            const reverted = new Set(favoriteIds);
            willLike ? reverted.delete(key) : reverted.add(key);
            set({ favoriteIds: reverted });
            throw error;
        
        } finally {
            const pending = new Set(get().favoriteIds);
            pending.delete(key);
            set({ pendingIds: pending });
        }

    }

}));