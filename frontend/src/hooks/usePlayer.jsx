import { useState, useEffect, useCallback, useRef } from "react";
import { getAccountLevel } from "../services/api";

import * as PLAYER_CONFIG from "../config/player_configs";
import { calculate_stat } from "../utils/player_utils";

export function usePlayer({ dungeon_id }) {
    const [ health, setHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);
    const [ max_health, setMaxHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);
    const [ attack, setAttack ] = useState(PLAYER_CONFIG.BASE_PLAYER_ATTACK);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });

    const [ isError, setIsError ] = useState(false);

    useEffect(() => {
        getAccountLevel().then(res => {
            if (!res.ok) {
                setIsError(true);
                return;
            }

            setAttack(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_ATTACK, res.data.level));

            const new_max_health = calculate_stat(PLAYER_CONFIG.BASE_PLAYER_HEALTH, res.data.level);
            setHealth(new_max_health);
            setMaxHealth(new_max_health);
        })
    }, [dungeon_id]);


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

    const hasError = useCallback(() => {
        return isError;
    }, [isError]);

    return {
        player: {
            health, max_health, attack, answer_stats
        },

        player_actions: {
            hit,
            updateStats,
            isDead,
            hasError
        }
    };
}
