const calculateLevelXP = (level) => {
    return (level - 1) * 100;
}

const calculateNextLevelProgression = (xp, level) => {
    const xp_level = calculateLevelXP(level);
    const xp_diff = xp - xp_level;
    const level_diff = calculateLevelXP(level + 1) - xp_level;

    return xp_diff / level_diff * 100; // mult by 100 to get a percentage
}

export {
    calculateLevelXP,
    calculateNextLevelProgression
}