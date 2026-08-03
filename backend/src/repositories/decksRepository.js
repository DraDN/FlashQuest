const db = require('../db');

const { enforceOwnership } = require('../utils/authUtils');

const getUserDecksStmt = db.prepare('SELECT * FROM decks WHERE user_id = ?');
const getDeckByIDStmt = db.prepare('SELECT * FROM decks WHERE id = ?');
const checkDeckExistsStmt = db.prepare('SELECT 1 FROM decks WHERE id = ?');
const getOwnerOfDeckStmt = db.prepare('SELECT user_id FROM decks WHERE id = ?');
const insertDeckStmt = db.prepare('INSERT INTO decks (user_id, name) VALUES (?, ?)');
const updateDeckNameStmt = db.prepare('UPDATE decks SET name = ? WHERE id = ?');
const updateDeckLevelStmt = db.prepare('UPDATE decks SET xp = ?, level = ? WHERE id = ?');
const deleteDeckStmt = db.prepare('DELETE FROM decks WHERE id = ?');

const getDecksOfDungeonStmt = db.prepare('SELECT * FROM decks WHERE id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

module.exports = {
	checkDeckExists(id) {
		return (checkDeckExistsStmt.get(id) != undefined);
	},

	getUserDecks(user_id) {
		return getUserDecksStmt.all(user_id);
	},

	getDeck(id) {
		return getDeckByIDStmt.get(id);
	},

	getOwnerOfDeck(id) {
		return getOwnerOfDeckStmt.get(id).user_id;
	},

	insertDeck(user_id, name) {
		return insertDeckStmt.run(user_id, name);
	}, // TODO maybe return .changes > 0

	updateDeckName(id, new_name) {
		return updateDeckNameStmt.run(new_name, id);
	},

	setDeckLevelXP(id, new_xp, new_level) {
		return updateDeckLevelStmt.run(Math.round(new_xp), new_level, id);
	},

	setDecksLevelXP: db.transaction((decks_level_infos, user_id) => {
		for (const deck_level_info of decks_level_infos) {
			const owner = getOwnerOfDeckStmt.get(deck_level_info.id).user_id;

			enforceOwnership(owner, user_id, `Deck ${deck_level_info.id}`);

			updateDeckLevelStmt.run(Math.round(deck_level_info.xp), Math.round(deck_level_info.level), deck_level_info.id);
		}
	}),

	deleteDeck(id) {
		return deleteDeckStmt.run(id);
	},

	getDecksOfDungeon(dungeon_id) {
		return getDecksOfDungeonStmt.all(dungeon_id);
	}
};