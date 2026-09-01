const db = require('../db');

const getCardByIDStmt = db.prepare('SELECT * FROM cards WHERE id = ?');
const getOwnderOfCardStmt = db.prepare('SELECT decks.user_id FROM decks INNER JOIN cards ON decks.id = cards.deck_id WHERE cards.id = ?');
const insertCardIntoDeckStmt = db.prepare('INSERT INTO cards (deck_id, question, answer, options) VALUES (?, ?, ?, ?)');
const updateCardStmt = db.prepare('UPDATE cards SET question = ?, answer = ?, options = ? WHERE id = ?');
const deleteCardStmt = db.prepare('DELETE FROM cards WHERE id = ?');

const getCardsOfDeckStmt = db.prepare('SELECT * FROM cards WHERE deck_id = ?');
const getCardsOfDungeonStmt = db.prepare('SELECT * FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

module.exports = {
	getCard(id) {
		return getCardByIDStmt.get(id);
	},

	getOwnerOfCard(id) {
		return getOwnderOfCardStmt.get(id).user_id;
	},

	insertCard(deck_id, question, answer, options) {
		return insertCardIntoDeckStmt.run(deck_id, question, answer, JSON.stringify(options));
	},

	updateCard(id, question, answer, options) {
		return updateCardStmt.run(question, answer, id, JSON.stringify(options));
	},

	deleteCard(id) {
		return deleteCardStmt.run(id);
	},

	getCardsOfDeck(deck_id) {
		return getCardsOfDeckStmt.all(deck_id).forEach(card => card.options = JSON.parse(card.options));
	},

	getCardsOfDungeon(dungeon_id) {
		return getCardsOfDungeonStmt.all(dungeon_id).forEach(card => card.options = JSON.parse(card.options));
	}
};
