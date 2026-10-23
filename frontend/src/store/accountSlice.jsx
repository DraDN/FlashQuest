import * as api from '../services/api';

export const createAccountSlice = (set, get) => ({
    coins: null,
    checked: false,

    getCoins: async () => {
        if (get().coins !== null) return get().coins;

        const fetched_coins_resp = await api.getAccountCoins();

        if (!fetched_coins_resp.ok) {
            throw new Error('Failed to fetch coins');
        }

        set({ coins: fetched_coins_resp.data });

        return fetched_coins_resp.data;
    },

    addCoins: async (amount) => {
        const update_coins_resp = await api.addAccountCoins(amount);

        if (!update_coins_resp.ok) {
            throw new Error('Failed to update coins');
        }

        set({ coins: get().coins + amount });
    },

    invalidateCoins: () => {
        set({ coins: null });
    },

    checkAccount: async () => {
        if (get().checked) return;

        const fetch_account_check_resp = await api.checkAccountInit();

        if (!fetch_account_check_resp.ok) {
            throw new Error('Failed to check account');
        }

        set({ checked: true });
    }
});