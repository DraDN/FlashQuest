const { AppError, NotFoundError } = require('../utils/errors');

const accountRepo = require('../repositories/accountRepository');

module.exports = {
	async ensureAccountIsInitialized(user_id) {
		const found = accountRepo.checkUserRecordExists(user_id);
		if (!found) {
			const result = accountRepo.insertUserRecord(user_id);
			if (result.changes === 0) {
				throw new AppError(500, 'Failed to initialize account');
			}

			return true;
		}

		return false;
	},

	async getAccountCoins(user_id) {
		const coins = accountRepo.getUserCoins(user_id);
		if (!coins) {
			throw new NotFoundError('Account coins not found');
		}

		return coins;
	},

	async setAccountCoins(user_id, coins) {
		const result = accountRepo.setUserCoins(user_id, coins);
		if (result.changes === 0) {
			const found = accountRepo.checkUserRecordExists(user_id);
			if (!found) {
				throw new NotFoundError('User ID not found');
			}

			throw new AppError(500, 'Failed to set account level');
		}

		return accountRepo.getUserCoins(user_id);
	},

	async addAccountCoins(user_id, added_coins) {
		const result = accountRepo.addUserCoins(user_id, added_coins);
		if (result.changes === 0) {
			const found = accountRepo.checkUserRecordExists(user_id);
			if (!found) {
				throw new NotFoundError('User ID not found');
			}
		}

		return accountRepo.getUserCoins(user_id);
	}
}