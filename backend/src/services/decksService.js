const { AppError, NotFoundError, ForbiddenError } = require('../utils/errors');
const { enforceOwnership } = require('../utils/authUtils');
const db = require('../db');

const decksRepo = require('../repositories/decksRepository');
const cardsRepo = require('../repositories/cardsRepository');

module.exports = {
	DECK_MAX_CHARACTERS: 100,

	async getUserDecks(user_id) {
		return decksRepo.getUserDecks(user_id);
	},

	async addDeck(user_id, name) {
		const insert_result = decksRepo.insertDeck(user_id, name);
		return decksRepo.getDeck(insert_result.lastInsertRowid);
	},

	async renameDeck(id, new_name, user_id) {
		const rename_transaction = db.transaction(() => {
			const owner = decksRepo.getOwnerOfDeck(id);

			enforceOwnership(owner, user_id, 'Deck');

			const update_result = decksRepo.updateDeckName(id, new_name)
		})

		rename_transaction();
		return decksRepo.getDeck(id);
	},

	async addDecksLevelXP(decks_level_info, user_id) {
		return decksRepo.addDecksLevelXP(decks_level_info, user_id);
	},

	async deleteDeck(id, user_id) {
		const delete_transaction = db.transaction(() => {
			const owner = decksRepo.getOwnerOfDeck(id);

			enforceOwnership(owner, user_id, 'Deck');

			const delete_result = decksRepo.deleteDeck(id);
		})

		delete_transaction();
	},

	async getDeckCards(id, user_id) {
		const cards_transaction = db.transaction(() => {
			const owner = decksRepo.getOwnerOfDeck(id);

			enforceOwnership(owner, user_id, 'Deck');

			return cardsRepo.getCardsOfDeck(id);
		})
		// const found = decksRepo.checkDeckExists(id);
		// if (!found) {
		// 	throw new NotFoundError('Deck ID not found');
		// }

		// return cardsRepo.getCardsOfDeck(id);
		return cards_transaction();
	}
};
