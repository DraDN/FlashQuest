const { AppError, NotFoundError } = require('../utils/errors');

const cardsRepo = require('../repositories/cardsRepository');
const decksRepo = require('../repositories/decksRepository');

module.exports = {
	CARD_MAX_CHARACTERS: 100,

	addCard(deck_id, question, answer) {
		const found = decksRepo.checkDeckExists(deck_id);
		if (!found) {
			throw new NotFoundError('Deck ID not found');
		}

		const add_result = cardsRepo.insertCard(deck_id, question, answer);
		return cardsRepo.getCard(add_result.lastInsertRowid);
	},

	editCard(id, question, answer) {
		const edit_result = cardsRepo.updateCard(id, question, answer);
		if (edit_result.changes === 0) {
			throw new NotFoundError('Card ID not found');
		}

		return cardsRepo.getCard(id);
	},

	deleteCard(id) {
		const delete_result = cardsRepo.deleteCard(id);
		if (delete_result.changes === 0) {
			throw new NotFoundError('Card ID not found');
		}
	}
};