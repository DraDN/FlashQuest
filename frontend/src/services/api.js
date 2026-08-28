const responseHandler = async (res) => {
    try {
        const data = await res.json();
        return {
            ok: res.ok,
            data: data
        }
    } catch (e) {
        return {
            ok: res.ok,
            data: null
        }
    }
}

// === ACCOUNT LEVEL ===

export const checkAccountInit = async () => 
    fetch(`/api/account/check-init`).then(responseHandler);

export const getAccountCoins = async () => 
    fetch(`/api/account/coins`).then(responseHandler);

export const setAccountCoins = async (coins) =>
    fetch(`/api/account/coins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coins })
    }).then(responseHandler);

export const addAccountCoins = async (added_coins) =>
    fetch(`/api/account/earn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ added_coins })
    }).then(responseHandler);

// === DECKS API ===

export const getDecks = async () => 
    fetch(`/api/decks`).then(responseHandler);

export const createDeck = async (name) => 
    fetch(`/api/decks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    }).then(responseHandler);

export const renameDeck = async (id, name) =>
    fetch(`/api/decks/${id}/rename`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    }).then(responseHandler);

export const deleteDeck = async (id) =>
    fetch(`/api/decks/${id}`, {
        method: 'DELETE'
    }).then(responseHandler);

// === CARDS API ===

export const getCards = async (deck_id) => 
    fetch(`/api/decks/${deck_id}/cards`).then(responseHandler);

export const createCard = async (deck_id, question, answer) => 
    fetch(`/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deck_id, question, answer })
    }).then(responseHandler);

export const editCard = async (card_id, question, answer) =>
    fetch(`/api/cards/${card_id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, answer })
    }).then(responseHandler);

export const deleteCard = async (id) =>
    fetch(`/api/cards/${id}`, {
        method: 'DELETE'
    }).then(responseHandler);

// === DUNGEONS API ===

export const getDungeons = async () => 
    fetch(`/api/dungeons`).then(responseHandler);

export const getDungeonDecks = async (dungeon_id) => 
    fetch(`/api/dungeons/${dungeon_id}/decks`).then(responseHandler);

export const getDungeonCards = async (dungeon_id) => 
    fetch(`/api/dungeons/${dungeon_id}/cards`).then(responseHandler);

export const createDungeon = async (name, deck_ids) => 
    fetch(`/api/dungeons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, deck_ids })
    }).then(responseHandler);

export const editDungeon = async (id, name, deck_ids) => 
    fetch(`/api/dungeons/${id}/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, deck_ids })
    }).then(responseHandler);

export const deleteDungeon = async (id) =>
    fetch(`/api/dungeons/${id}`, {
        method: 'DELETE'
    }).then(responseHandler);
