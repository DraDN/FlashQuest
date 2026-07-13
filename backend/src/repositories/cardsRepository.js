const db = require('../db');

const getCardByIDStmt = db.prepare('SELECT * FROM cards WHERE id = ?');
const insertCardIntoDeckStmt = db.prepare('INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)');
const updateCardStmt = db.prepare('UPDATE cards SET question = ?, answer = ? WHERE id = ?');
const deleteCardStmt = db.prepare('DELETE FROM cards WHERE id = ?');

const getCardsOfDeckStmt = db.prepare('SELECT * FROM cards WHERE deck_id = ?');
const getCardsOfDungeonStmt = db.prepare('SELECT * FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

module.exports = {
	CARD_MAX_CHARACTERS: 100,

	getCardByID(id) {
		return getCardByIDStmt.get(id);
	},

	getCardsOfDeck(deck_id) {
		return getCardsOfDeckStmt.all(deck_id);
	},

	addCard(deck_id, question, answer) {
		return insertCardIntoDeckStmt.run(deck_id, question, answer);
	},

	editCard(id, question, answer) {
		return updateCardStmt.run(question, answer, id);
	},

	deleteCard(id) {
		return deleteCardStmt.run(id);
	},

	getCardsOfDeck(deck_id) {
		return getCardsOfDeckStmt.all(deck_id);
	},

	getCardsOfDungeon(dungeon_id) {
		return getCardsOfDungeonStmt.all(dungeon_id);
	}
};
