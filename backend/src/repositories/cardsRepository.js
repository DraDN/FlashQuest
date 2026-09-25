const { createEmptyCard } = require('ts-fsrs');
const db = require('../db');

const getCardByIDStmt = db.prepare('SELECT id, deck_id, question, answers, options, due FROM cards WHERE id = ?');
const getCardSRDataStmt = db.prepare('SELECT sr_data FROM cards WHERE id = ?');
const getOwnderOfCardStmt = db.prepare('SELECT decks.user_id FROM decks INNER JOIN cards ON decks.id = cards.deck_id WHERE cards.id = ?');
const insertCardIntoDeckStmt = db.prepare('INSERT INTO cards (deck_id, question, answers, options, sr_data) VALUES (?, ?, ?, ?, ?)');
const updateQCardStmt = db.prepare('UPDATE cards SET question = ?, answers = ?, options = ? WHERE id = ?');
const updateSRCardStmt = db.prepare('UPDATE cards SET sr_data = ?, due = ? WHERE id = ?');
const deleteCardStmt = db.prepare('DELETE FROM cards WHERE id = ?');

const getCardsOfDeckStmt = db.prepare('SELECT id, deck_id, question, answers, options, due FROM cards WHERE deck_id = ?');
const getCardsOfDungeonStmt = db.prepare('SELECT id, deck_id, question, answers, options, due FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)');

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
		return insertCardIntoDeckStmt.run(deck_id, question, compress_answers(answers), JSON.stringify(options), JSON.stringify(createEmptyCard()));
	},

	updateQCard(id, question, answers, options) {
		return updateQCardStmt.run(question, compress_answers(answers), JSON.stringify(options), id);
	},

	// updateSRCard(id, repetitions, easy_factor, interval) {
		// return updateSRCardStmt.run(repetitions, easy_factor, `+${interval} days`, id);
	// },
	getCardSRData(id) {
		const data = getCardSRDataStmt.get(id);
		return JSON.parse(data.sr_data);
	},

	updateSRCard(id, sr_data) {
		const data = JSON.stringify(sr_data);
		const due = sr_data.due.toISOString();
		console.log(data);
		console.log("at ", id);
		return updateSRCardStmt.run(data, due, id);
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
