import * as DUNGEON_CONFIGS from "../config/dungeon_configs";

const get_room_progression_index = (round) => {
    return ((round - 1) % 10) + 1;
}

const get_floor_index = (round) => {
    return Math.floor((round - 1) / 10);
}

const get_coin_reward = (round) => {
    const config = DUNGEON_CONFIGS.FLOOR_CONFIG.find(floor => {
        const [ min_round, max_round ] = floor.round_range;
        return min_round <= round && max_round >= round;
    }).coin_reward;

    const deviation = Math.random() * DUNGEON_CONFIGS.RANDOM_COIN_DEVIATION_MULTIPLIER;

    const reward = Math.round(config * (1 + deviation));
    return reward;
}

export { get_room_progression_index, get_floor_index, get_coin_reward }