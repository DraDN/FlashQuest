import { useState, useEffect, useCallback } from "react";
import { getDungeonDecks, levelUpDecks, levelUpAccount } from "../services/api";
import { calculateLevelUpXP } from "../utils/xp_utils";

export function useXPManager({ dungeon_id }) {
    const [ decks, setDecks ] = useState(undefined);
    const [ isError, setIsError ] = useState(false);

    useEffect(() => {
        getDungeonDecks(dungeon_id).then(res => {
            if (!res.ok) {
                setIsError(true);
                return;
            }

            const decks = res.data;
            const newDecks = decks.map((d) => ({
                id: d.id,
                name: d.name,
                xp: d.xp,
                level: d.level,
                xp_gained: 0,
                level_gained: 0
            }))

            setDecks(newDecks);
        });
    }, [dungeon_id]);

    const rewardXPToDeck = useCallback((deck_id, xp) => {
        // TODO: maybe add guards like this in more places
        if (!deck_id || !xp) { return; }

        setDecks((prevDecks) => {
            const newDecks = [...prevDecks];
            const deckIndex = newDecks.findIndex((d) => d.id === deck_id);

            if (deckIndex !== -1) {
                newDecks.at(deckIndex).xp_gained += xp;
            }

            return newDecks;
        });
    });

    const level_up_decks = useCallback((decks, percentage) => {
        let total_levels_gained = 0;
        const leveled_decks = decks.map((d) => {
            let level_gained = 0;

            let xp_needed_for_next_level = calculateLevelUpXP(d.level + level_gained);
            const xp_gained = Math.round(d.xp_gained * percentage);

            while (xp_gained >= xp_needed_for_next_level) {
                level_gained++;
                xp_needed_for_next_level += calculateLevelUpXP(d.level + level_gained);
            }

            total_levels_gained += level_gained;

            return {
                ...d,
                xp_gained: xp_gained,
                level_gained: level_gained
            };
        })

        return {
            leveled_decks: leveled_decks,
            levels_gained: total_levels_gained
        }
    }, [decks]);

    const save = async (percentage) => {
        const { leveled_decks, levels_gained } = level_up_decks(decks, percentage);

        // TODO: handle errors
        if (levels_gained > 0) {
            const res = await levelUpAccount(levels_gained);
        }

        const res = await levelUpDecks(leveled_decks);

        return leveled_decks;
    };

    const isLoading = useCallback(() => {
        return (decks === undefined);
    }, [decks]);

    const hasError = useCallback(() => {
        return isError;
    }, [isError]);

    return {
        xp_actions: {
            rewardXPToDeck,
            save,
            isLoading,
            hasError
        }
    }
}