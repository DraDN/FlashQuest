import { get_room_progression_index, get_floor_index } from "./dungeon_utils";
import * as MONSTER_CONFIGS from "../config/monster_configs";

const calculate_random_stat = (base_stat, floor_mult, tier_mult) =>
    Math.round((base_stat * floor_mult + (Math.random() * MONSTER_CONFIGS.RANDOM_DEVIATION)) * tier_mult);


const get_room_configs = (room_pregression_index) =>
    MONSTER_CONFIGS.FLOOR_CONFIG.filter(floor => {
        const [ min_round, max_round ] = floor.round_range;
        return min_round <= room_pregression_index && max_round >= room_pregression_index;
    });


const get_monster_tier = (tier_id) => 
    MONSTER_CONFIGS.TIER_TEMPLATES.find(tier => tier.id === tier_id);

const get_monster_tier_from_monster = (monster, tier_list) => {
    const allowed_tiers = tier_list.filter(tier => monster.allowed_tiers.includes(tier));
    const random_index = Math.floor(Math.random() * allowed_tiers.length);
    const tier_id = allowed_tiers.at(random_index);

    return get_monster_tier(tier_id);
}

const get_monster_template = (difficulty_range, tier_list) => {
    const [ min_difficulty, max_difficulty ] = difficulty_range;
    const filtered_templates = MONSTER_CONFIGS.MONSTER_TEMPLATES.filter(template => (
        template.difficulty >= min_difficulty &&
        template.difficulty <= max_difficulty &&
        template.allowed_tiers.some(tier => tier_list.includes(tier))
    ));

    if (filtered_templates.length === 0) {
        return null;
    }

    const random_index = Math.floor(Math.random() * filtered_templates.length)
    return filtered_templates.at(random_index);
}


const generate_monster = (difficulty_range, tier_list, round) => {
    const floor_index = get_floor_index(round);
    const floor_mult = MONSTER_CONFIGS.get_floor_mult(floor_index);

    const monster_template = get_monster_template(difficulty_range, tier_list);
    const tier = get_monster_tier_from_monster(monster_template, tier_list);
    const asset = MONSTER_CONFIGS.get_monster_asset(monster_template);

    const max_health = calculate_random_stat(monster_template.health, floor_mult, tier.health_mult);
    const attack = calculate_random_stat(monster_template.attack, floor_mult, tier.attack_mult);
    const xp = calculate_random_stat(monster_template.xp, floor_mult, tier.xp_mult);

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

    const configs = get_room_configs(room_pregression_index);

    const monsters = [];
    for (let i = 0; i < configs.length && monsters.length < MONSTER_CONFIGS.MAX_NO_MONSTERS; i++) {
        const config = configs.at(i);

        let no_monsters = Math.round(Math.random() * (config.max_monsters - config.min_monsters) + config.min_monsters);
        no_monsters = Math.min(no_monsters, MONSTER_CONFIGS.MAX_NO_MONSTERS - monsters.length);

        for (let i = 0; i < no_monsters; i++) {
            monsters.push(generate_monster(config.difficulty_range, config.tier_list, round));
        }   
    }
    
    return monsters;
}

export { generate_monsters }