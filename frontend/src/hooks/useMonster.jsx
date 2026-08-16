import { useState, useCallback } from "react";
import { generate_monsters } from "../utils/monster_utils";
import { MAX_NO_MONSTERS } from "../utils/monster_configs";

export function useMonster({ round }) {
    const [ monsters, setMonsters ] = useState(() => generate_monsters(round));

    const [ selected_monster, setSelectedMonster ] = useState(null);

    const generateRound = (round) => {
        setMonsters(() => generate_monsters(round));
    }

    const setSelected = useCallback((monster_index) => {
        if (monster_index < 0 || monster_index >= MAX_NO_MONSTERS) { return; }

        setSelectedMonster(monster_index);
    });

    const getSelectedID = useCallback(() => {
        return selected_monster;
    }, [selected_monster]);

    const getSelected = useCallback(() => {
        return monsters.at(selected_monster);
    }, [monsters, selected_monster]);

    const hitSelected = useCallback((attack) => {
        if (selected_monster === null) { return; }

        const new_monsters = [...monsters];
        new_monsters.at(selected_monster).health -= attack;
        new_monsters.at(selected_monster).is_hit = true;

        setMonsters(new_monsters);

        setTimeout(() => {
            setMonsters(prevMonsters => {
                const alive_monsters = prevMonsters.filter(mon => mon.health > 0);
                const updated_monsters = alive_monsters.map(mon => ({...mon, is_hit: false }));

                return updated_monsters;
            });
        }, 800);
    }, [monsters, selected_monster]);

    return {
        monsters: monsters,

        monster_actions: {
            generateRound,
            setSelected,
            getSelectedID,
            getSelected,
            hitSelected,
        }
    }
}