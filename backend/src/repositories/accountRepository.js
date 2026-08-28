const db = require('../db');

const userExistsStmt = db.prepare('SELECT 1 FROM user_coins WHERE user_id = ?');
const insertUserRecordStmt = db.prepare('INSERT INTO user_coins (user_id, coins) VALUES (?, 0)');
const getUserCoinsStmt = db.prepare('SELECT * FROM user_coins WHERE user_id = ?');
const setUserCoinsStmt = db.prepare('UPDATE user_coins SET coins = ? WHERE user_id = ?');
const addUserCoinsStmt = db.prepare('UPDATE user_coins SET coins = coins + ? WHERE user_id = ?');


module.exports = {
	checkUserRecordExists(user_id) {
		return (userExistsStmt.get(user_id) != undefined);
	}, 

	insertUserRecord(user_id) {
		return insertUserRecordStmt.run(user_id);
	},

	getUserCoins(user_id) {
		return getUserCoinsStmt.get(user_id);
	},

	setUserCoins(user_id, coins) {
		return setUserCoinsStmt.run(coins, user_id);
	},

	addUserCoins(user_id, added_coins) {
		return addUserCoinsStmt.run(added_coins, user_id);
	}
};