const MAX_NO_MONSTERS = 5;
const MONSTER_SCALE_FACTOR = 1.3;
const RANDOM_DEVIATION = 5;

const TIER_TEMPLATES = [
    { id: "Weak", health_mult: 0.5, attack_mult: 0.25, xp_mult: 0.5 },
    { id: "Normal", health_mult: 1, attack_mult: 1, xp_mult: 1 },
    { id: "Hard", health_mult: 1.5, attack_mult: 1.25, xp_mult: 1.25 },
    { id: "Elite", health_mult: 2, attack_mult: 1.75, xp_mult: 1.5 },
    { id: "Boss", health_mult: 1, attack_mult: 1, xp_mult: 1 },
];

const MONSTER_TEMPLATES = [
    { id: "spider", name: "Spider", health: 10, attack: 5, xp: 1, difficulty: 1, allowed_tiers: ["Weak", "Normal"] },
    { id: "armored_spider", name: "Armored Spider", health: 22, attack: 15, xp: 5, difficulty: 4, allowed_tiers: ["Normal", "Hard"] },
    { id: "snake", name: "Snake", health: 12, attack: 7, xp: 1, difficulty: 1, allowed_tiers: ["Weak", "Normal"] },
    { id: "titan_beetle", name: "Titan Beetle", health: 15, attack: 4, xp: 1, difficulty: 1, allowed_tiers: ["Weak", "Normal", "Hard"] },
    { id: "chamite", name: "Chamite", health: 10, attack: 7, xp: 1, difficulty: 1, allowed_tiers: ["Weak", "Normal"] },
    { id: "lileaf", name: "Lileaf", health: 14, attack: 7, xp: 2, difficulty: 2, allowed_tiers: ["Normal"] },
    { id: "fyngtor", name: "Fyngtor", health: 14, attack: 9, xp: 2, difficulty: 2, allowed_tiers: ["Normal"] },
    { id: "roktor", name: "Roktor", health: 15, attack: 9, xp: 2, difficulty: 2, allowed_tiers: ["Normal", "Hard"] },
    { id: "grol", name: "Grol", health: 14, attack: 9, xp: 2, difficulty: 2, allowed_tiers: ["Normal"] },
    { id: "chrofyr", name: "Chrofyr", health: 7, attack: 18, xp: 3, difficulty: 3, allowed_tiers: ["Weak", "Normal", "Hard"] },
    { id: "fynstalk", name: "Fynstalk", health: 7, attack: 7, xp: 1, difficulty: 1, allowed_tiers: ["Weak", "Normal"] },
    { id: "distalk", name: "Distalk", health: 14, attack: 25, xp: 4, difficulty: 4, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "thorborg", name: "Thorborg", health: 20, attack: 13, xp: 5, difficulty: 5, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "golem", name: "Golem", health: 25, attack: 14, xp: 6, difficulty: 5, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "gotech", name: "GoTech", health: 35, attack: 21, xp: 10, difficulty: 7, allowed_tiers: ["Hard", "Elite"] },
    { id: "grachem", name: "Grachem", health: 25, attack: 20, xp: 8, difficulty: 6, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "vulcalyn", name: "Vulcalyn", health: 26, attack: 20, xp: 9, difficulty: 6, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "obsidiron", name: "Obsidiron", health: 30, attack: 17, xp: 8, difficulty: 6, allowed_tiers: ["Hard", "Elite"] },
    { id: "chaohara", name: "Chaohara", health: 40, attack: 26, xp: 12, difficulty: 8, allowed_tiers: ["Hard", "Elite"] },
    { id: "stragris", name: "Stragris", health: 35, attack: 23, xp: 9, difficulty: 7, allowed_tiers: ["Hard", "Elite"] },
    { id: "qaelriar", name: "Qaelriar", health: 25, attack: 22, xp: 9, difficulty: 7, allowed_tiers: ["Normal", "Hard", "Elite"] },
    { id: "vrusenu", name: "Vrusenu", health: 80, attack: 55, xp: 25, difficulty: 0, allowed_tiers: ["Boss"] },
    { id: "baby_dragon", name: "Baby Dragon", health: 50, attack: 35, xp: 25, difficulty: 10, allowed_tiers: ["Boss"] },
    { id: "dragon", name: "Dragon", health: 85, attack: 60, xp: 25, difficulty: 10, allowed_tiers: ["Boss"] },
    { id: "ukega", name: "Ukega", health: 80, attack: 60, xp: 25, difficulty: 10, allowed_tiers: ["Boss"] }
];

const FLOOR_CONFIG = [
    { round_range: [1, 3], difficulty_range: [1, 3], tier_list: ["Weak", "Normal"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS },
    { round_range: [3, 3], difficulty_range: [3, 5], tier_list: ["Normal", "Hard"], min_monsters: 0, max_monsters: 1 },
    { round_range: [4, 6], difficulty_range: [3, 6], tier_list: ["Normal", "Hard"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 2 },
    { round_range: [7, 8], difficulty_range: [5, 9], tier_list: ["Normal", "Hard", "Elite"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 4 },
    { round_range: [9, 9], difficulty_range: [1, 4], tier_list: ["Weak"], min_monsters: MAX_NO_MONSTERS / 2, max_monsters: MAX_NO_MONSTERS },
    { round_range: [10, 10], difficulty_range: [10, 10], tier_list: ["Boss"], min_monsters: 1, max_monsters: 1 }
]

const get_monster_asset = (monster_template) => {
    return {
        name: monster_template.name,
        image: `/monsters/${monster_template.id}.png`
    }
}

const get_floor_mult = (floor_index) => 
    Math.pow(MONSTER_SCALE_FACTOR, floor_index);

export {
    MAX_NO_MONSTERS,
    MONSTER_SCALE_FACTOR,
    RANDOM_DEVIATION,
    MONSTER_TEMPLATES,
    TIER_TEMPLATES,
    FLOOR_CONFIG,
    get_monster_asset,
    get_floor_mult
}
