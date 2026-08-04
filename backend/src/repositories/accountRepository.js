const db = require('../db');

const userExistsStmt = db.prepare('SELECT 1 FROM user_levels WHERE user_id = ?');
const insertUserLevelStmt = db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, 0)');
const getUserLevelStmt = db.prepare('SELECT * FROM user_levels WHERE user_id = ?');
const setUserLevelStmt = db.prepare('UPDATE user_levels SET level = ? WHERE user_id = ?');
const addUserLevelStmt = db.prepare('UPDATE user_levels SET level = level + ? WHERE user_id = ?');


module.exports = {
	checkUserLevelExists(user_id) {
		return (userExistsStmt.get(user_id) != undefined);
	}, 

	insertUserLevel(user_id) {
		return insertUserLevelStmt.run(user_id);
	},

	getUserLevel(user_id) {
		return getUserLevelStmt.get(user_id);
	},

	setUserLevel(user_id, level) {
		return setUserLevelStmt.run(level, user_id);
	},

	addUserLevels(user_id, added_levels) {
		return addUserLevelStmt.run(added_levels, user_id);
	}
};