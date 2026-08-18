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
    { id: "skeleton", name: "Skeleton", health: 10, attack: 5, xp: 5, difficulty: 1, allowed_tiers: ["Weak", "Normal"] },
    { id: "goblin", name: "Goblin", health: 12, attack: 5, xp: 5, difficulty: 2, allowed_tiers: ["Weak", "Normal", "Hard"] },
    { id: "orc", name: "Orc", health: 12, attack: 7, xp: 5, difficulty: 3, allowed_tiers: ["Hard", "Elite", "Boss"] },
];

const FLOOR_CONFIG = [
    { round_range: [1, 3], difficulty_range: [1, 3], tier_list: ["Weak", "Normal"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS },
    { round_range: [3, 3], difficulty_range: [2, 3], tier_list: ["Normal", "Hard"], min_monsters: 0, max_monsters: 1 },
    { round_range: [4, 6], difficulty_range: [2, 3], tier_list: ["Hard"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 2 },
    { round_range: [7, 8], difficulty_range: [2, 3], tier_list: ["Hard", "Elite"], min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 4 },
    { round_range: [9, 9], difficulty_range: [2, 3], tier_list: ["Weak"], min_monsters: MAX_NO_MONSTERS / 2, max_monsters: MAX_NO_MONSTERS },
    { round_range: [10, 10], difficulty_range: [3, 3], tier_list: ["Boss"], min_monsters: 1, max_monsters: 1 }
]

const get_monster_asset = (monster_template) => {
    return {
        name: monster_template.name,
        image: `/monsters/${monster_template.id}.png`
    }
}

export {
    MAX_NO_MONSTERS,
    MONSTER_SCALE_FACTOR,
    RANDOM_DEVIATION,
    MONSTER_TEMPLATES,
    TIER_TEMPLATES,
    get_monster_asset,
}
