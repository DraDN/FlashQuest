import { useState, useEffect, useCallback, useRef } from "react";

import { addAccountCoins } from "../services/api";

import * as PLAYER_CONFIG from "../config/player_configs";
import { calculate_stat } from "../utils/player_utils";
import { calculateTotalLevelXP } from "../utils/xp_utils";

function usePlayer() {
    const [ health, setHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);
    const [ max_health, setMaxHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);

    const [ attack, setAttack ] = useState(PLAYER_CONFIG.BASE_PLAYER_ATTACK);

    const [ xp, setXp ] = useState(0);
    const [ level, setLevel ] = useState(1);

    const [ coins, setCoins ] = useState(0);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });
    const [ gained, setGained ] = useState({ xp: 0, level: 0, coins: 0 });


    const update_stats = useCallback((new_level) => {
        const new_max_health = calculate_stat(PLAYER_CONFIG.BASE_PLAYER_HEALTH, new_level);
        const new_health = health + (new_max_health - max_health);

        setMaxHealth(new_max_health);
        setHealth(new_health);
        setAttack(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_ATTACK, new_level));
    });

    const rewardXP = useCallback((gained_xp) => {
        const new_xp = xp + gained_xp;
        const gained_level = (new_xp >= calculateTotalLevelXP(level + 1)) ? 1 : 0;

        setXp(new_xp);
        setLevel(prev_level => {
            if (gained_level === 0) {
                return prev_level;
            }

            update_stats(prev_level + 1);
            return prev_level + 1;
        });

        setGained(prev_gains => ({
            ...prev_gains,
            xp: prev_gains.xp + gained_xp,
            level: prev_gains.level + gained_level,
        }));
    }, [update_stats, level, xp]);

    const rewardCoins = useCallback((gained_coins) => {
        setCoins(prev_coins => prev_coins + gained_coins);
        setGained(prev_gains => ({
            ...prev_gains,
            coins: prev_gains.coins + gained_coins,
        }));
    });

    const resetGained = useCallback(() => {
        setGained({ xp: 0, level: 0, coins: 0 });
    });

    const getTotal = useCallback((keep_percentage) => {
        return {
            xp: xp,
            level: level,
            coins: coins
        };
    }, [xp, level, coins]);

    const saveCoins = useCallback((keep_percentage) => {
        return addAccountCoins(Math.round(coins * keep_percentage));
    }, [coins]);


    const hit = useCallback((damage) => {
        setHealth(prevHealth => {
            return prevHealth - damage;
        });
    });

    const updateStats = useCallback((correct) => {
        setAnswerStats(prev_stats => {
            const new_answer_stats = {...prev_stats};

            if (correct) {
                new_answer_stats.correct += 1;
            } else {
                new_answer_stats.incorrect += 1;
            }

            return new_answer_stats;
        });
    });

    const isDead = useCallback(() => {
        return (health <= 0);
    }, [health]);


    return {
        player: {
            health,
            max_health,
            attack,
            answer_stats,
            gained
        },

        player_actions: {
            rewardXP,
            rewardCoins,
            resetGained,
            getTotal,
            saveCoins,
            hit,
            updateStats,
            isDead,
        }
    };
}

export default usePlayer;
