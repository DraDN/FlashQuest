const accountRepo = require('../repositories/accountRepository');

module.exports = {
	async ensureAccountIsInitialized(user_id) {
		const found = accountRepo.checkUserLevelExists(user_id);
		if (!found) {
			const result = accountRepo.insertUserLevel(user_id);
			if (result.changes === 0) {
				throw new Error('FAIL');
			}

			return true;
		}

		return false;
	},

	async getAccountLevel(user_id) {
		const level = accountRepo.getUserLevel(user_id);
		if (!level) {
			throw new Error('NOT_FOUND');
		}

		return level;
	},

	async setAccountLevel(user_id, level) {
		const result = accountRepo.setUserLevel(user_id, level);
		if (result.changes === 0) {
			const found = accountRepo.checkUserLevelExists(user_id);
			if (!found) {
				throw new Error('NOT_FOUND');
			}

			throw new Error('FAIL');
		}

		return accountRepo.getUserLevel(user_id);
	},

	async addAccountLevels(user_id, added_levels) {
		const result = accountRepo.addUserLevels(user_id, added_levels);
		if (result.changes === 0) {
			const found = accountRepo.checkUserLevelExists(user_id);
			if (!found) {
				throw new Error('NOT_FOUND');
			}
		}

		return accountRepo.getUserLevel(user_id);
	}
}