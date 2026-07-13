const db = require('../db');

const getUserDecksStmt = db.prepare('SELECT * FROM decks WHERE user_id = ?');
const getDeckByIDStmt = db.prepare('SELECT * FROM decks WHERE id = ?');
const checkDeckExistsStmt = db.prepare('SELECT 1 FROM decks WHERE id = ?');
const insertDeckStmt = db.prepare('INSERT INTO decks (user_id, name) VALUES (?, ?)');
const updateDeckNameStmt = db.prepare('UPDATE decks SET name = ? WHERE id = ?');
const updateDeckLevelStmt = db.prepare('UPDATE decks SET xp = ?, level = ? WHERE id = ?');
const deleteDeckStmt = db.prepare('DELETE FROM decks WHERE id = ?');

const getDecksOfDungeonStmt = db.prepare('SELECT * FROM decks WHERE id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

const checkDeckExists = (id) => (checkDeckExistsStmt.get(id) != undefined);

module.exports = {
	DECK_MAX_CHARACTERS: 100,

	getUserDecks(user_id) {
		return getUserDecksStmt.all(user_id);
	},

	addDeck(user_id, name) {
		const result = insertDeckStmt.run(user_id, name);
		return getDeckByIDStmt.get(result.lastInsertRowid);
	},

	renameDeck(id, new_name) {
		const result = updateDeckNameStmt.run(id, name);
		if (result.changes === 0) {
			throw new Error('NOT_FOUND');
		}

		return getDeckByIDStmt.get(id);
	},

	setDeckLevelXP(id, new_xp, new_level) {
		return updateDeckLevelStmt.run(new_xp, new_level, id);
	},

	setDecksLevelXP: db.transaction((decks_level_infos) => {
		for (const deck_level_info of decks_level_infos) {
			if (updateDeckLevelStmt.run(deck_level_info.xp, deck_level_info.level, deck_level_info.id).changes === 0) {
				throw new Error(`Deck ID ${deck_level_info.id} not found`);
			}
		}
	}),

	deleteDeck(id) {
		return deleteDeckStmt.run(id);
	},

	getDecksOfDungeon(dungeon_id) {
		return getDecksOfDungeonStmt.all(dungeon_id);
	}
};