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

	async renameDeck(id, new_name) {
		const update_result = decksRepo.updateDeckName(id, new_name)
		if (update_result.changes === 0) {
			throw new Error('NOT_FOUND');
		}

		return decksRepo.getDeck(id);
	},

	async setDecksLevelXP(decks_level_info) {
		try {
			return decksRepo.setDecksLevelXP(decks_level_info);
		} catch (error) {
			if (error.message.startsWith('NOT_FOUND:')) {
                const missingId = error.message.split(':')[1];
                throw new Error(`Deck progress update failed. Deck ID ${missingId} does not exist.`);
            }
			throw error;
		}
	},

	async deleteDeck(id) {
		const delete_result = decksRepo.deleteDeck(id);
		if (delete_result.changes === 0) {
			throw new Error('NOT_FOUND');
		}
	},

	async getDeckCards(id) {
		const found = decksRepo.checkDeckExists(id);
		if (!found) {
			throw new Error('NOT_FOUND');
		}

		return cardsRepo.getCardsOfDeck(id);
	}
};
