import { get_room_progression_index, get_floor_index } from "./dungeon_utils";
import { MONSTER_ASSETS, MAX_NO_MONSTERS, MONSTER_SCALE_FACTOR, RANDOM_DEVIATION, get_monster_tier, get_floor_config } from "../config/monster_configs";

const get_floor_mult = (floor_index) => {
    return Math.pow(MONSTER_SCALE_FACTOR, floor_index);
}

const get_random_monster_asset = () => {
    return MONSTER_ASSETS[Math.floor(Math.random() * MONSTER_ASSETS.length)];
}

const calculate_random_stat = (base_stat, floor_mult) => {
    return Math.round(base_stat * floor_mult + Math.random() * RANDOM_DEVIATION);
}

const generate_monster = (tier_id, round) => {
    const floor_index = get_floor_index(round);
    const floor_mult = get_floor_mult(floor_index);

    const tier = get_monster_tier(tier_id);
    const asset = get_random_monster_asset();

    const max_health = calculate_random_stat(tier.base_health, floor_mult);
    const attack = calculate_random_stat(tier.base_attack, floor_mult);
    const xp = calculate_random_stat(tier.base_xp, floor_mult);

    return {
        tier: tier.id,
        asset: asset,
        health: max_health,
        max_health: max_health,
        attack: attack,
        xp_reward: xp,
        is_hit: false
    }
}

const generate_monsters = (round) => {
    const room_pregression_index = get_room_progression_index(round);

    const configs = get_floor_config(room_pregression_index);

    const monsters = [];
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        if (monsters.length >= MAX_NO_MONSTERS) { break; }

        let no_monsters = Math.round(Math.random() * (config.max_monsters - config.min_monsters) + config.min_monsters);
        no_monsters = Math.min(no_monsters, MAX_NO_MONSTERS - monsters.length);

        for (let i = 0; i < no_monsters; i++) {
            monsters.push(generate_monster(config.tier_id, round));
        }   
    }
    
    return monsters;
}

export { generate_monsters }