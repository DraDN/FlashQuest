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
    const [ level, setLevel ] = useState(0);

    const [ coins, setCoins ] = useState(0);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });
    const [ last_gain_state, setLastGainState ] = useState({ xp: 0, level: 0, coins: 0 });


    const rewardXP = useCallback((gained_xp) => {
        const new_xp = xp + gained_xp;
        const gained_level = level + (new_xp >= calculateTotalLevelXP(level + 1) ? 1 : 0);

        setXp(new_xp);
        setLevel(prev_level => prev_level + gained_level);
    });

    const rewardCoins = useCallback((gained_coins) => {
        setCoins(prev_coins => prev_coins + gained_coins);
    });


    const getGained = useCallback((keep_percentage) => {
        const gained = {
            xp: xp - last_gain_state.xp,
            level: level - last_gain_state.level,
            coins: coins - Math.round(last_gain_state.coins * keep_percentage)
        };

        setLastGainState({ xp, level, coins });

        return gained;
    }, [xp, level, coins, last_gain_state]);

    const saveCoins = useCallback((keep_percentage) => {
        return addAccountCoins(Math.round(coins * keep_percentage));
    }, [coins]);


    useEffect(() => {
        setMaxHealth(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_HEALTH, level));
        setAttack(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_ATTACK, level));
    }, [level]);



    const hit = useCallback((damage) => {
        setHealth(prevHealth => prevHealth - damage);
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
            answer_stats
        },

        player_actions: {
            rewardXP,
            rewardCoins,
            getGained,
            saveCoins,
            hit,
            updateStats,
            isDead,
        }
    };
}

export default usePlayer;
