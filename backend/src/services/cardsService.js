const db = require('../db');
const { AppError, NotFoundError } = require('../utils/errors');

const { enforceOwnership } = require('../utils/authUtils');

const cardsRepo = require('../repositories/cardsRepository');
const decksRepo = require('../repositories/decksRepository');

module.exports = {
	CARD_MAX_CHARACTERS: 100,

	addCard(deck_id, question, answer, user_id) {
		const add_transaction = db.transaction(() => {
			const owner = decksRepo.getOwnerOfDeck(deck_id);

			enforceOwnership(owner, user_id, 'Deck');

			const add_result = cardsRepo.insertCard(deck_id, question, answer);
			return cardsRepo.getCard(add_result.lastInsertRowid);
		});

		return add_transaction();
	},

	editCard(id, question, answer, user_id) {
		const edit_transaction = db.transaction(() => {
			const owner = cardsRepo.getOwnerOfCard(id);

			enforceOwnership(owner, user_id, 'Card');

			const edit_result = cardsRepo.updateCard(id, question, answer);
			return cardsRepo.getCard(id);
		})

		return edit_transaction();
	},

	deleteCard(id, user_id) {
		const delete_transaction = db.transaction(() => {
			const owner = cardsRepo.getOwnerOfCard(id);

			enforceOwnership(owner, user_id, 'Card');

			cardsRepo.deleteCard(id);
		})
		
		delete_transaction();
	}
};