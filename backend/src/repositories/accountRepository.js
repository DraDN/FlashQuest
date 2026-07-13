const db = require('../db');

const userExistsStmt = db.prepare('SELECT 1 FROM user_levels WHERE user_id = ?');
const insertUserLevelStmt = db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, 0)');
const getUserLevelStmt = db.prepare('SELECT * FROM user_levels WHERE user_id = ?');
const setUserLevelStmt = db.prepare('UPDATE user_levels SET level = ? WHERE user_id = ?');
const addUserLevelStmt = db.prepare('UPDATE user_levels SET level = level + ? WHERE user_id = ?');

const checkAccountExists = (user_id) => (userExistsStmt.get(user_id) != undefined);

module.exports = {
	checkAccountStatus(user_id) {
		const found = checkAccountExists(user_id);
		if (!found) {
			const result = insertUserLevelStmt.run(user_id);
			if (result.changes === 0) {
				throw new Error('FAIL');
			}

			return true;
		}

		return false;
	},

	getUserLevel(user_id) {
		const level = getUserLevelStmt.get(user_id);
		if (!level) {
			throw new Error('NOT_FOUND');
		}

		return level;
	},

	setUserLevel(user_id, new_level) {
		const result = setUserLevelStmt.run(user_id, level);
		if (result.changes === 0) {
			const found = checkAccountExists(user_id);
			if (!found) {
				throw new Error('NOT_FOUND');
			}
		}

		return getUserLevelStmt.get(user_id);
	},

	addUserLevels(user_id, added_levels) {
		const result = addUserLevelStmt.run(added_levels, user_id);
		if (result.changes === 0) {
			const found = checkAccountExists(user_id);
			if (!found) {
				throw new Error('NOT_FOUND');
			}
		}

		return getUserLevelStmt.get(user_id);
	}
};