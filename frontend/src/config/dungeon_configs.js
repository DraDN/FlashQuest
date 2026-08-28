const EARLY_FLEE_FEE = 0.6;
const MODAL_POPUP_DELAY = 1000;
const RANDOM_COIN_DEVIATION_MULTIPLIER = 0.5;

const FLOOR_CONFIG = [
    { round_range: [1, 3], coin_reward: 7 },
    { round_range: [4, 6], coin_reward: 10 },
    { round_range: [7, 8], coin_reward: 15 },
    { round_range: [9, 9], coin_reward: 20 },
    { round_range: [10, 10], coin_reward: 50 }
];

export {
    EARLY_FLEE_FEE,
    MODAL_POPUP_DELAY,
    FLOOR_CONFIG,
    RANDOM_COIN_DEVIATION_MULTIPLIER
};