const db = require('../db');

const dungeonsRepo = require('../repositories/dungeonsRepository');
const decksRepo = require('../repositories/decksRepository');
const cardsRepo = require('../repositories/cardsRepository');

module.exports = {
	DUNGEON_MAX_CHARACTERS: 50,

	async getUserDungeons(user_id) {
		return dungeonsRepo.getUserDungeons(user_id);
	},

	async getDungeonDecks(id) {
		const found = dungeonsRepo.checkDungeonExists(id);
		if (!found) {
			throw new Error('NOT_FOUND');
		}

		return decksRepo.getDecksOfDungeon(id);
	},

	async getDungeonCards(id) {
		const found = dungeonsRepo.checkDungeonExists(id);
		if (!found) {
			throw new Error('NOT_FOUND');
		}

		return cardsRepo.getCardsOfDungeon(id);
	},

	async addDungeon(user_id, name, deck_ids) {
		const add_transaction = db.transaction((userId, dungeonName, deckIds) => {
			for (const deckId of deckIds) {
				const deck_exists = decksRepo.checkDeckExists(deckId);
				if (!deck_exists) {
					throw new Error(`NOT_FOUND:${deckId}`);
				}
			} 

			const insert_result = dungeonsRepo.insertDungeon(userId, dungeonName);
			const dungeonId = insert_result.lastInsertRowid;

			for (const deckId of deckIds) {
				dungeonsRepo.linkDeckToDungeon(dungeonId, deckId);
			}

			return dungeonsRepo.getDungeon(dungeonId);
		});

		try {
			return add_transaction(user_id, name, deck_ids);
		} catch (error) {
			if (error.message.startsWith('NOT_FOUND:')) {
                const missingId = error.message.split(':')[1];
                throw new Error(`Cannot create dungeon. Deck ID ${missingId} does not exist.`);
            }
            throw error;
		}
	},

	async editDungeon(user_id, new_name, new_deck_ids) {
		const edit_transaction = db.transaction((dungeonId, newDungeonName, newDeckIds) => {
			for (const deckId of newDeckIds) {
				if (!decksRepo.checkDeckExists(deckId)) {
					throw new Error(`DECK_NOT_FOUND:${deckId}`);
				}
			}

			const rename_result = dungeonsRepo.updateDungeonName(dungeonId, newDungeonName);
			if (rename_result.changes === 0) {
				throw new Error('DUNGEON_NOT_FOUND');
			}

			dungeonsRepo.deleteDungeon(dungeonId);
			for (const deckId of newDeckIds) {
				dungeonsRepo.linkDeckToDungeon(dungeonId, deckId);
			}

			return dungeonsRepo.getDungeon(dungeonId);
		});

		try {
			return edit_transaction(user_id, new_name, new_deck_ids);
		} catch (error) {
			if (error.message.startsWith('DECK_NOT_FOUND:')) {
                const missingId = error.message.split(':')[1];
                throw new Error(`Cannot create dungeon. Deck ID ${missingId} does not exist.`);
            } else if (error.message === 'DUNGEON_NOT_FOUND') {
				throw new Error('NOT_FOUND')
			}

            throw error;
		}
	},

	async deleteDungeon(id) {
		const delete_result = dungeonsRepo.deleteDungeon(id);
		if (delete_result.changes === 0) {
			throw new Error('NOT_FOUND');
		}
	}
};