const MAX_NO_MONSTERS = 5;
const MONSTER_SCALE_FACTOR = 1.3;
const RANDOM_DEVIATION = 5;

const MONSTER_TEMPLATES = [
    { id: "skeleton", name: "Skeleton" },
    { id: "goblin", name: "Goblin" },
    { id: "orc", name: "Orc" },
]

const TIER_TEMPLATES = [
    { id: "Weak", base_health: 10, base_attack: 5, base_xp: 5 },
    { id: "Normal", base_health: 20, base_attack: 10, base_xp: 10 },
    { id: "Hard", base_health: 30, base_attack: 10, base_xp: 15 },
    { id: "Elite", base_health: 40, base_attack: 15, base_xp: 25 },
    { id: "Boss", base_health: 100, base_attack: 20, base_xp: 50 },
]

const MONSTER_ASSETS = MONSTER_TEMPLATES.map(monster => ({
    name: monster.name,
    image: `/monsters/${monster.id}.png`
}))

const FLOOR_CONFIG = [
    { round_range: [1, 3], tier_id: "Normal", min_monsters: 1, max_monsters: MAX_NO_MONSTERS-1 },
    { round_range: [3, 3], tier_id: "Hard", min_monsters: 0, max_monsters: 1 },
    { round_range: [4, 6], tier_id: "Hard", min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 2 },
    { round_range: [7, 8], tier_id: "Elite", min_monsters: 1, max_monsters: MAX_NO_MONSTERS / 4 },
    { round_range: [9, 9], tier_id: "Weak", min_monsters: MAX_NO_MONSTERS / 2, max_monsters: MAX_NO_MONSTERS },
    { round_range: [10, 10], tier_id: "Boss", min_monsters: 1, max_monsters: 1 }
]

const get_monster_tier = (tier_id) => 
    TIER_TEMPLATES.find(tier => tier.id === tier_id);

const get_floor_config = (room_pregression_index) => 
    FLOOR_CONFIG.filter(floor => floor.round_range[0] <= room_pregression_index && floor.round_range[1] >= room_pregression_index);

export { MAX_NO_MONSTERS, MONSTER_SCALE_FACTOR, RANDOM_DEVIATION, MONSTER_TEMPLATES, TIER_TEMPLATES, MONSTER_ASSETS, get_monster_tier, get_floor_config }
