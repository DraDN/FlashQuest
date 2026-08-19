const calculateLevelUpXP = (start_level) => {
    return (start_level + 1) * 100;
}

const calculateTotalLevelXP = (level) => {
    // arithmetic series sum, changed to account for a_n = (n-1)*b aka. ( n = level + 1 )
    return (level * (level + 1) * 100) / 2;
}

const calculateNextLevelProgression = (xp, level) => {
    const xp_level = calculateTotalLevelXP(level);
    const xp_diff = xp - xp_level;
    const level_diff = calculateTotalLevelXP(level + 1) - xp_level;

    return xp_diff / level_diff * 100; // mult by 100 to get a percentage
}

export {
    calculateLevelUpXP,
    calculateTotalLevelXP,
    calculateNextLevelProgression
}