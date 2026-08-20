const MAX_HAND_SIZE = 5;
const BASE_PLAYER_ATTACK = 10;
// const ATTACK_SCALE_FACTOR = 1.12;
const BASE_PLAYER_HEALTH = 100;

const SCALE_FACTOR = Math.pow(1.3, 0.25);

const get_level_mult = (level) => 
    Math.pow(SCALE_FACTOR, level - 1);

export {
    MAX_HAND_SIZE,
    BASE_PLAYER_ATTACK,
    // ATTACK_SCALE_FACTOR,
    BASE_PLAYER_HEALTH,
    get_level_mult
}