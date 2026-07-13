const db = require('../db');

const getUserDungeonsStmt = db.prepare('SELECT * FROM dugneons WHERE user_id = ?');
const getDungeonByIDStmt = db.prepare('SELECT * FROM dungeons WHERE id = ?');
const checkDungeonExistsStmt = db.prepare('SELECT 1 FROM dungeons WHERE id = ?');
const insertDungeonStmt = db.prepare('INSERT INTO dungeons (user_id, name) VALUES (?, ?)');
const insertDungeonDeckStmt = db.prepare('INSERT INTO dungeon_decks (dungeon_id, deck_id) VALUES (?, ?)');
const updateDungeonNameStmt = db.prepare('UPDATE dungeons SET name = ? WHERE id = ?');
const deleteDungeonStmt = db.prepare('DELETE FROM dungeons WHERE id = ?');
const deleteDungeonsDecksStmt = db.prepare('DELETE FROM dungeon_decks WHERE dungeon_id = ?');

const { checkDeckExists } = require('./decksRepository');

module.exports = {
	DUNGEON_MAX_CHARACTERS: 50,

	getDungeonByID(id) {
		return getDungeonByIDStmt.get(id);
	},

	getUserDungeons(user_id) {
		return getUserDungeonsStmt.all(user_id);
	},

	checkDungeonExists(id) {
		return (checkDungeonExistsStmt.get(id) != undefined);
	},

	addDungeon: db.transaction((userId, dungeonName, deckIds) => {
		for (const deckId of deckIds) {
			const deck_exists = checkDeckExistsStmt.get(deckId);
			if (!deck_exists) {
				throw new Error(`Deck ID ${deckId} not found`);
			}
		} 

		const result = insertDungeonStmt.run(userId, dungeonName);
		const dungeonId = result.lastInsertRowid;

		for (const deckId of deckIds) {
			insertDungeonDeckStmt.run(dungeonId, deckId);
		}

		return getDungeonByIDStmt.get(dungeonId);
	}),

	editDungeon: db.transaction((dungeonId, newDungeonName, newDeckIds) => {
		for (const deckId of newDeckIds) {
			if (!checkDeckExists.get(deckId)) {
				throw new Error(`Deck ID ${deckId} does not exist`);
			}
		}

		const result = updateDungeonNameStmt.run(newDungeonName, dungeonId);
		if (result.changes === 0) {
			throw new Error('DUNGEON_NOT_FOUND');
		}

		deleteDungeonsDecksStmt.run(dungeonId);
		for (const deckId of newDeckIds) {
			insertDungeonDeckStmt.run(dungeonId, deckId);
		}

		return getDungeonByIDStmt.get(dungeonId);
	}),
	
	deleteDungeon(id) {
		return deleteDungeonStmt.run(id);
	}
};