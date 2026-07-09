// === ACCOUNT LEVEL ===

export const checkAccountStatus = async (user_id) => 
    fetch(`/api/check-status?user_id=${user_id}`).then(res => res.json());

export const getAccountLevel = async (user_id) => 
    fetch(`/api/level-account?user_id=${user_id}`).then(res => res.json());

export const setAccountLevel = async (user_id, level) =>
    fetch(`/api/level-account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, level })
    }).then(res => res.json());

export const levelUpAccount = async (user_id, added_levels) =>
    fetch(`/api/level-up-account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, added_levels })
    }).then(res => res.json());

// === DECKS API ===

export const getDecks = async (user_id) => 
    fetch(`/api/decks?user_id=${user_id}`).then(res => res.json());

export const createDeck = async (user_id, name) => 
    fetch(`/api/decks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, name })
    }).then(res => res.json());

export const renameDeck = async (id, name) =>
    fetch(`/api/decks/${id}/rename`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    }).then(res => res.json());

export const levelDecks = async (decks) => {
    return fetch(`/api/decks/sync-xp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decks })
    }).then(res => {
        if (!res.ok) {
            res.json().then(err => { throw err; });
        }
    });
}

export const deleteDeck = async (id) =>
    fetch(`/api/decks/${id}`, {
        method: 'DELETE'
    });

// === CARDS API ===

export const getCards = async (deck_id) => 
    fetch(`/api/decks/${deck_id}/cards`).then(res => res.json());

export const createCard = async (deck_id, question, answer) => 
    fetch(`/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deck_id, question, answer })
    }).then(res => res.json());

export const editCard = async (card_id, question, answer) =>
    fetch(`/api/cards/${card_id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, answer })
    }).then(res => res.json());

export const deleteCard = async (id) =>
    fetch(`/api/cards/${id}`, {
        method: 'DELETE'
    });

// === DUNGEONS API ===

export const getDungeons = async (user_id) => 
    fetch(`/api/dungeons?user_id=${user_id}`).then(res => res.json());

export const getDungeonDecks = async (dungeon_id) => 
    fetch(`/api/dungeons/${dungeon_id}/decks`).then(res => res.json());

export const getDungeonCards = async (dungeon_id) => 
    fetch(`/api/dungeons/${dungeon_id}/cards`).then(res => res.json());

export const createDungeon = async (user_id, name, deck_ids) => 
    fetch(`/api/dungeons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, name, deck_ids })
    }).then(res => res.json());

export const editDungeon = async (id, name, deck_ids) => 
    fetch(`/api/dungeons/${id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, deck_ids })
    }).then(res => res.json());

export const deleteDungeon = async (id) =>
    fetch(`/api/dungeons/${id}`, {
        method: 'DELETE'
    });
