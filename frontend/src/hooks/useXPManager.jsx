import { useState, useEffect } from "react";
import { getDungeonDecks, levelUpDecks, levelUpAccount } from "../services/api";
import { calculateLevelXP } from "../utils/xp_utils";

export function useXPManager({ dungeon_id }) {
    const [ decks, setDecks ] = useState([]);

    useEffect(() => {
        getDungeonDecks(dungeon_id).then((decks) => {
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

    const rewardXPToDeck = (deck_id, xp) => {
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
    };

    const level_up_decks = (decks, percentage) => {
        let total_levels_gained = 0;
        const leveled_decks = decks.map((d) => {
            let level_gained = 0;

            let xp_needed_for_next_level = calculateLevelXP(d.level + level_gained + 1);
            const xp_gained = Math.round(d.xp_gained * percentage);
            const total_xp = d.xp + xp_gained;

            while (total_xp >= xp_needed_for_next_level) {
                level_gained++;
                xp_needed_for_next_level = (d.level + level_gained) * 100;
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
    };

    const save = async (percentage) => {
        const { leveled_decks, levels_gained } = level_up_decks(decks, percentage);

        if (levels_gained > 0) {
            await levelUpAccount(levels_gained);
        }

        await levelUpDecks(leveled_decks);

        return leveled_decks;
    };

    return {
        xp_actions: {
            rewardXPToDeck,
            save
        }
    }
}