const db = require('../db');

const { enforceOwnership } = require('../utils/authUtils');

const dungeonsRepo = require('../repositories/dungeonsRepository');
const decksRepo = require('../repositories/decksRepository');
const cardsRepo = require('../repositories/cardsRepository');

module.exports = {
	DUNGEON_MAX_CHARACTERS: 50,

	async getUserDungeons(user_id) {
		return dungeonsRepo.getUserDungeons(user_id);
	},

	async getDungeonDecks(id, user_id) {
		const decks_transaction = db.transaction(() => {
			const owner = dungeonsRepo.getOwnerOfDungeon(id);

			enforceOwnership(owner, user_id, 'Dungeon');

			return decksRepo.getDecksOfDungeon(id);
		})

		return decks_transaction();
	},

	async getDungeonCards(id, user_id) {
		const cards_transaction = db.transaction(() => {
			const owner = dungeonsRepo.getOwnerOfDungeon(id);

			enforceOwnership(owner, user_id, 'Dungeon');

			return cardsRepo.getCardsOfDungeon(id);
		})

		return cards_transaction();
	},

	async addDungeon(user_id, name, deck_ids) {
		const add_transaction = db.transaction(() => {
			for (const deck_id of deck_ids) {
				const owner = decksRepo.getOwnerOfDeck(deck_id);
				enforceOwnership(owner, user_id, 'Deck');
			} 

			const insert_result = dungeonsRepo.insertDungeon(user_id, name);
			const dungeonId = insert_result.lastInsertRowid;

			for (const deckId of deck_ids) {
				dungeonsRepo.linkDeckToDungeon(dungeonId, deckId);
			}

			return dungeonsRepo.getDungeon(dungeonId);
		});

		return add_transaction();
	},

	async editDungeon(id, new_name, new_deck_ids, user_id) {
		const edit_transaction = db.transaction(() => {
			for (const deck_id of new_deck_ids) {
				const owner = decksRepo.getOwnerOfDeck(deck_id);
				enforceOwnership(owner, user_id, 'Deck');
			}

			const owner = dungeonsRepo.getOwnerOfDungeon(id);
			enforceOwnership(owner, user_id, 'Dungeon');

			const rename_result = dungeonsRepo.updateDungeonName(id, new_name);
			if (rename_result.changes === 0) {
				throw new Error('DUNGEON_NOT_FOUND');
			}

			dungeonsRepo.updateDungeonName(id, new_name);
			for (const deckId of new_deck_ids) {
				dungeonsRepo.linkDeckToDungeon(id, deckId);
			}

			return dungeonsRepo.getDungeon(id);
		});

		return edit_transaction();
	},

	async deleteDungeon(id) {
		const delete_transaction = db.transaction(() => {
			const owner = dungeonsRepo.getOwnerOfDungeon(id);

			enforceOwnership(owner, user_id, 'Dungeon');

			dungeonsRepo.deleteDungeon(id);
		})

		delete_transaction();
	}
};