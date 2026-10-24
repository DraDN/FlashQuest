import * as api from '../services/api';

export const createDungeonSlice = (set, get) => ({ 
    dungeons: null,
    dungeonDecks: {},

    // Dungeons

    getCachedDungeons: async () => {
        if (get().dungeons !== null) return get().dungeons;

        const fetched_dungeons_resp = await api.getDungeons();

        if (!fetched_dungeons_resp.ok) {
            throw new Error('Failed to fetch dungeons');
        }

        set({ dungeons: fetched_dungeons_resp.data });

        return fetched_dungeons_resp.data;
    },

    addCachedDungeon: async (name, deck_ids) => {
        const new_dungeon_res = await api.createDungeon(name, deck_ids);

        if (!new_dungeon_res.ok) {
            throw new Error('Failed to create dungeon');
        }

        set({ dungeons: [...get().dungeons, new_dungeon_res.data] });
        set({ dungeonDecks: { ...get().dungeonDecks, [new_dungeon_res.data.id]: get().decks.filter(d => deck_ids.includes(d.id)) } });

        return new_dungeon_res.data;
    },

    editCachedDungeon: async (id, name, deck_ids) => {
        const edited_dungeon_res = await api.editDungeon(id, name, deck_ids);

        if (!edited_dungeon_res.ok) {
            throw new Error('Failed to edit dungeon');
        }

        set({ dungeons: get().dungeons.map(d => d.id === id ? edited_dungeon_res.data : d) });
        set({ dungeonDecks: { ...get().dungeonDecks, [id]: get().decks.filter(d => deck_ids.includes(d.id)) } });

        return edited_dungeon_res.data;
    },

    deleteCachedDungeon: async (id) => {
        await api.deleteDungeon(id);

        set({ dungeons: get().dungeons.filter(d => d.id !== id) });
        set((prev) => {
            const new_dungeonDecks = { ...prev.dungeonDecks };
            delete new_dungeonDecks[id];
            return { dungeonDecks: new_dungeonDecks };
        });
    },

    // Dungeon decks

    getCachedDungeonDecks: async (dungeon_id) => {
        const cached_decks = get().dungeonDecks[dungeon_id];
        if (cached_decks) return cached_decks;

        const fetched_decks_resp = await api.getDungeonDecks(dungeon_id);

        if (!fetched_decks_resp.ok) {
            throw new Error('Failed to fetch dungeon decks');
        }

        set({ dungeonDecks: { ...get().dungeonDecks, [dungeon_id]: fetched_decks_resp.data } });

        return fetched_decks_resp.data;
    },

    invalidateDungeonDecksCache: (dungeon_id) => {
        set((prev) => {
            const newDungeonDecks = { ...prev.dungeonDecks };
            delete newDungeonDecks[dungeon_id];
            return { dungeonDecks: newDungeonDecks };
        });
    }
})