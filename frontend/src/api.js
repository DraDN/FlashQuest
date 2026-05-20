const API = import.meta.env.VITE_API_URL;

// === DECKS API ===

export const getDecks = async (user_id) => 
    fetch(`${API}/api/decks?user_id=${user_id}`).then(res => res.json());

export const createDeck = async (user_id, name) => 
    fetch(`${API}/api/decks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, name })
    }).then(res => res.json());

export const renameDeck = async (id, name) =>
    fetch(`${API}/api/decks/${id}/rename`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    }).then(res => res.json());

export const deleteDeck = async (id) =>
    fetch(`${API}/api/decks/${id}`, {
        method: 'DELETE'
    }).then(res => res.json());

// === CARDS API ===

export const getCards = async (deck_id) => 
    fetch(`${API}/api/decks/${deck_id}/cards`).then(res => res.json());

export const createCard = async (deck_id, question, answer) => 
    fetch(`${API}/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deck_id, question, answer })
    }).then(res => res.json());

export const editCard = async (card_id, question, answer) =>
    fetch(`${API}/api/cards/${card_id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, answer })
    }).then(res => res.json());

export const deleteCard = async (id) =>
    fetch(`${API}/api/cards/${id}`, {
        method: 'DELETE'
    }).then(res => res.json());

// === DUNGEONS API ===

export const getDungeons = async (user_id) => 
    fetch(`${API}/api/dungeons?user_id=${user_id}`).then(res => res.json());

export const getDungeonDecks = async (dungeon_id) => 
    fetch(`${API}/api/dungeons/${dungeon_id}/decks`).then(res => res.json());

export const getDungeonCards = async (dungeon_id) => 
    fetch(`${API}/api/dungeons/${dungeon_id}/cards`).then(res => res.json());

export const createDungeon = async (user_id, name, deck_ids) => 
    fetch(`${API}/api/dungeons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, name, deck_ids })
    }).then(res => res.json());

export const editDungeon = async (id, name, deck_ids) => 
    fetch(`${API}/api/dungeons/${id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, deck_ids })
    }).then(res => res.json());

export const deleteDungeon = async (id) =>
    fetch(`${API}/api/dungeons/${id}`, {
        method: 'DELETE'
    }).then(res => res.json());
