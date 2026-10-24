import * as api from '../services/api';

export const createDeckSlice = (set, get) => ({ 
    decks: null,
    deckCards: {},

    // Decks

    getCachedDecks: async () => {
        if (get().decks !== null) return get().decks;

        const fetched_decks_resp = await api.getDecks();

        if (!fetched_decks_resp.ok) {
            throw new Error('Failed to fetch decks');
        }

        set({ decks: fetched_decks_resp.data });

        return fetched_decks_resp.data;
    },

    addCachedDeck: async (name) => {
        const new_deck_res = await api.createDeck(name);

        if (!new_deck_res.ok) {
            throw new Error('Failed to create deck');
        }

        set({ decks: [...get().decks, new_deck_res.data] });

        return new_deck_res.data;
    },

    renameCachedDeck: async (id, name) => {
        const edited_deck_res = await api.renameDeck(id, name);

        if (!edited_deck_res.ok) {
            throw new Error('Failed to edit deck');
        }

        set({ decks: get().decks.map(d => d.id === id ? edited_deck_res.data : d) });

        return edited_deck_res.data;
    },

    deleteCachedDeck: async (id) => {
        const delete_deck_res = await api.deleteDeck(id);

        if (!delete_deck_res.ok) {
            throw new Error('Failed to delete deck');
        }

        set({ decks: get().decks.filter(d => d.id !== id) });
        set((prev) => { 
            const new_deckCards = { ...prev.deckCards };
            delete new_deckCards[id];
            return { deckCards: new_deckCards };
        });
    },

    // Cards

    getCachedDeckCards: async (deck_id) => {
        const cached_cards = get().deckCards[deck_id];
        if (cached_cards) return cached_cards;

        const fetched_cards_resp = await api.getCards(deck_id);

        if (!fetched_cards_resp.ok) {
            throw new Error('Failed to fetch deck cards');
        }

        set({ deckCards: { ...get().deckCards, [deck_id]: fetched_cards_resp.data } });

        return fetched_cards_resp.data
    },

    addCachedDeckCard: async (deck_id, question, answers, options) => {
        const new_card_res = await api.createCard(deck_id, question, answers, options);

        if (!new_card_res.ok) {
            throw new Error('Failed to create card');
        }

        set({ deckCards: { ...get().deckCards, [deck_id]: [...get().deckCards[deck_id], new_card_res.data] } });

        return new_card_res.data;
    },

    editCachedDeckCard: async (deck_id, card_id, question, answers, options) => {
        const edited_card_res = await api.editCard(card_id, question, answers, options);

        if (!edited_card_res.ok) {
            throw new Error('Failed to edit card');
        }

        set({ deckCards: { ...get().deckCards, [deck_id]: get().deckCards[deck_id].map(c => c.id === card_id ? edited_card_res.data : c) } });

        return edited_card_res.data;
    },

    deleteCachedDeckCard: async (deck_id, card_id) => {
        await api.deleteCard(card_id);

        set({ deckCards: { ...get().deckCards, [deck_id]: get().deckCards[deck_id].filter(c => c.id !== card_id) } });
    },

    invalidateDeckCardsCache: (deck_id) => {
        set((prev) => {
            const newDeckCards = { ...prev.deckCards };
            delete newDeckCards[deck_id];
            return { deckCards: newDeckCards };
        });
    },
});
