const db = require('../db');

const getCardByIDStmt = db.prepare('SELECT * FROM cards WHERE id = ?');
const getOwnderOfCardStmt = db.prepare('SELECT decks.user_id FROM decks INNER JOIN cards ON decks.id = cards.deck_id WHERE cards.id = ?');
const insertCardIntoDeckStmt = db.prepare('INSERT INTO cards (deck_id, question, answers, options) VALUES (?, ?, ?, ?)');
const updateCardStmt = db.prepare('UPDATE cards SET question = ?, answers = ?, options = ? WHERE id = ?');
const deleteCardStmt = db.prepare('DELETE FROM cards WHERE id = ?');

const getCardsOfDeckStmt = db.prepare('SELECT * FROM cards WHERE deck_id = ?');
const getCardsOfDungeonStmt = db.prepare('SELECT * FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

function decompress_answers(comp_answers) {
	let answers = [];

	while (comp_answers > 0) {
		answers.push(comp_answers % 10 -1);
		comp_answers = Math.floor(comp_answers / 10);
	}

	return answers;
}

function compress_answers(answers) {
	let comp_answers = 0;

	for (let i = 0; i < answers.length; i++) {
		comp_answers = comp_answers * 10 + answers.at(i) +1;
	}

	return comp_answers;
}

module.exports = {
	getCard(id) {
		const card = getCardByIDStmt.get(id);
		card.options = JSON.parse(card.options);
		card.answers = decompress_answers(card.answers);
		return card;
	},

	getOwnerOfCard(id) {
		return getOwnderOfCardStmt.get(id).user_id;
	},

	insertCard(deck_id, question, answers, options) {
		return insertCardIntoDeckStmt.run(deck_id, question, compress_answers(answers), JSON.stringify(options));
	},

	updateCard(id, question, answers, options) {
		return updateCardStmt.run(question, compress_answers(answers), JSON.stringify(options), id);
	},

	deleteCard(id) {
		return deleteCardStmt.run(id);
	},

	getCardsOfDeck(deck_id) {
		const cards = getCardsOfDeckStmt.all(deck_id);
		cards.forEach(card => {
			card.options = JSON.parse(card.options);
			card.answers = decompress_answers(card.answers);
		});
		return cards;
	},

	getCardsOfDungeon(dungeon_id) {
		const cards = getCardsOfDeckStmt.all(dungeon_id);
		cards.forEach(card => {
			card.options = JSON.parse(card.options);
			card.answers = decompress_answers(card.answers);
		});
		return cards;
	}
};
