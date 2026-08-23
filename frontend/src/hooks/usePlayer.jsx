import { useState, useEffect, useCallback, useRef } from "react";

import * as PLAYER_CONFIG from "../config/player_configs";
import { calculate_stat } from "../utils/player_utils";
import { calculateTotalLevelXP } from "../utils/xp_utils";

function usePlayer() {
    const [ health, setHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);
    const [ max_health, setMaxHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);

    const [ attack, setAttack ] = useState(PLAYER_CONFIG.BASE_PLAYER_ATTACK);

    const [ xp, setXp ] = useState(0);
    const [ level, setLevel ] = useState(0);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });
    const [ gained, setGained ] = useState({ xp: 0, level: 0 });


    const reward = useCallback((gained_xp) => {
        const new_xp = xp + gained_xp;
        const new_level = level + (new_xp >= calculateTotalLevelXP(level + 1) ? 1 : 0);

        setXp(new_xp);
        setLevel(new_level);
        setGained({ xp: new_xp, level: new_level });
    });

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
            answer_stats,
            gained
        },

        player_actions: {
            reward,
            hit,
            updateStats,
            isDead,
        }
    };
}

export default usePlayer;
