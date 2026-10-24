const { fsrs, Rating, generatorParameters } = require('ts-fsrs');
const db = require('../db');

const sr_parameters = generatorParameters({
	request_retention: 0.85,
	maximum_interval: 365
});

const sr_scheduler = fsrs(sr_parameters);

const { enforceOwnership } = require('../utils/authUtils');

const cardsRepo = require('../repositories/cardsRepository');
const decksRepo = require('../repositories/decksRepository');

module.exports = {
	CARD_MAX_CHARACTERS: 100,
	CARD_MAX_OPTIONS: 4,

	addCard(deck_id, question, answers, options, user_id) {
		const add_transaction = db.transaction(() => {
			const owner = decksRepo.getOwnerOfDeck(deck_id);

			enforceOwnership(owner, user_id, 'Deck');

			const add_result = cardsRepo.insertCard(deck_id, question, answers, options);
			return cardsRepo.getCard(add_result.lastInsertRowid);
		});

		return add_transaction();
	},

	editCard(id, question, answers, options, user_id) {
		const edit_transaction = db.transaction(() => {
			const owner = cardsRepo.getOwnerOfCard(id);

			enforceOwnership(owner, user_id, 'Card');

			const edit_result = cardsRepo.updateQCard(id, question, answers, options);
			return cardsRepo.getCard(id);
		})

		return edit_transaction();
	},

	gradeCards(grades, user_id) {
		const grade_transaction = db.transaction(() => {
			for (const grade of grades) {
				const owner = cardsRepo.getOwnerOfCard(grade.id);

				enforceOwnership(owner, user_id, 'Card');

				const card_data = cardsRepo.getCardSRData(grade.id);

				let translated_grade;
				if (grade.grade === 0) {
					translated_grade = Rating.Again;
				} else if (grade.grade === 1) {
					translated_grade = Rating.Hard;
				} else if (grade.grade === 2) {
					translated_grade = Rating.Good;
				} else if (grade.grade === 3) {
					translated_grade = Rating.Easy;
				}

				const sr_data = sr_scheduler.next(card_data, new Date(), translated_grade).card;

				cardsRepo.updateSRCard(grade.id, sr_data);
			}
		})

		return grade_transaction();
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