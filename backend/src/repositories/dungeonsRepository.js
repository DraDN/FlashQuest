const db = require('../db');

const getUserDungeonsStmt = db.prepare('SELECT * FROM dungeons WHERE user_id = ?');
const getDungeonByIDStmt = db.prepare('SELECT * FROM dungeons WHERE id = ?');
const checkDungeonExistsStmt = db.prepare('SELECT 1 FROM dungeons WHERE id = ?');
const insertDungeonStmt = db.prepare('INSERT INTO dungeons (user_id, name) VALUES (?, ?)');
const insertDungeonDeckStmt = db.prepare('INSERT INTO dungeon_decks (dungeon_id, deck_id) VALUES (?, ?)');
const updateDungeonNameStmt = db.prepare('UPDATE dungeons SET name = ? WHERE id = ?');
const deleteDungeonStmt = db.prepare('DELETE FROM dungeons WHERE id = ?');
const deleteDungeonsDecksStmt = db.prepare('DELETE FROM dungeon_decks WHERE dungeon_id = ?');

const { checkDeckExists } = require('./decksRepository');

module.exports = {
	getDungeon(id) {
		return getDungeonByIDStmt.get(id);
	},

	getUserDungeons(user_id) {
		return getUserDungeonsStmt.all(user_id);
	},

	checkDungeonExists(id) {
		return (checkDungeonExistsStmt.get(id) != undefined);
	},

	insertDungeon(user_id, name) {
		return insertDungeonStmt.run(user_id, name);
	},

	linkDeckToDungeon(dungeon_id, deck_id) {
		return insertDungeonDeckStmt.run(dungeon_id, deck_id);
	},

	updateDungeonName(dungeon_id, new_name) {
		return updateDungeonNameStmt.run(new_name, dungeon_id);
	},
	
	deleteDungeon(id) {
		return deleteDungeonStmt.run(id);
	}
};