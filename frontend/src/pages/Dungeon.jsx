import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useUser } from "@clerk/clerk-react";

import { getDungeonCards, getDungeonDecks, levelDecks, levelUpAccount, getAccountLevel } from "../utils/api";

import { PlayerUI, PlayerCard } from "../components/PlayerUI";
import { usePlayer } from "../components/usePlayer";

import Monsters from "../components/MonsterUI";

import AttackModal from "../components/AttackModal";
import RoundEndModal from "../components/RoundEndModal";
import EarlyFleeModal from "../components/EarlyFleeModal";
import DeathModal from "../components/DeathModal";

const MAX_NO_MONSTERS = 5;
const EARLY_FLEE_FEE = 0.6;
const MONSTER_ATTACK_SCALE_FACTOR = 1.3;

let count = 0;

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

const get_room_progression_index = (round) => {
    return ((round - 1) % 10) + 1;
}

const get_monster = (round) => {
    const floor_index = Math.floor((round - 1) / 10);
    const floor_mult = Math.pow(MONSTER_ATTACK_SCALE_FACTOR, floor_index);
    const room_pregression_index = get_room_progression_index(round);

    let tier_id = "Normal";
    if (room_pregression_index >= 4 && room_pregression_index <= 6) tier_id = "Hard";
    else if (room_pregression_index >= 7 && room_pregression_index <= 8) tier_id = "Elite";
    else if (room_pregression_index == 9) tier_id = "Weak";
    else if (room_pregression_index == 10) tier_id = "Boss";

    let tier = TIER_TEMPLATES.find(tier => tier.id === tier_id);

    const monster_asset = MONSTER_ASSETS[Math.floor(Math.random() * MONSTER_ASSETS.length)];

    const max_health = Math.round(tier.base_health * floor_mult + Math.random() * 5);

    const attack = Math.round(tier.base_attack * floor_mult + Math.random() * 5);

    const xp = Math.round(tier.base_xp * floor_mult + Math.random() * 5);

    return {
        id: count++,
        tier: tier.id,
        asset: monster_asset,
        health: max_health,
        max_health: max_health,
        attack: attack,
        xp_reward: xp,
        is_hit: false
    }
}

export default function Dungeon({ dungeon, onNavigate }) {
    const { user } = useUser();

    const { player, player_actions } = usePlayer({ dungeon_id: dungeon.id });

    const [ decks, setDecks ] = useState([]);
    const [ round, setRound ] = useState(1);

    const [ selected_monster, setSelectedMonster ] = useState(null);

    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ isRoundEndModalOpen, setIsRoundEndModalOpen ] = useState(false);
    const [ isEarlyFleeModalOpen, setIsEarlyFleeModalOpen ] = useState(false);
    const [ isDeathModalOpen, setIsDeathModalOpen ] = useState(false);

    const generate_monsters = () => {
        const new_monsters = [];
        const progression_index = get_room_progression_index(round);
        let number_of_monsters = Math.round(Math.random() * (MAX_NO_MONSTERS - 1) + 1);
        if (progression_index >= 4 && progression_index <= 6) { number_of_monsters = Math.round(Math.random() * MAX_NO_MONSTERS / 2) + 1; }
        else if (progression_index >= 7 && progression_index <= 8) { number_of_monsters = Math.round(Math.random() * MAX_NO_MONSTERS / 4) + 1; }
        else if (progression_index == 9) { number_of_monsters = Math.round(Math.random() * MAX_NO_MONSTERS/2 + MAX_NO_MONSTERS/2); }
        else if (progression_index == 10) { number_of_monsters = 1; }
        for (let i = 0; i < number_of_monsters; i++) {
            new_monsters.push(get_monster(round));
        }
        return new_monsters;
    }
    const [ monsters, setMonsters ] = useState(() => generate_monsters());
    
    const nextRoom = () => {
        setRound(round + 1);
        setMonsters(generate_monsters());
    }

    useEffect(() => {
        getAccountLevel(user.id).then((level) => {
            player_actions.setAttackBasedOnLevel(level.level);
        });
    }, [user?.id]);

    const reward_deck_xp = (deck_id, xp) => {
    //     setDecks((prevDecks) =>
    //         prevDecks.map((d) => {
    //             if (d.id === deck_id) {
    //                 const new_xp_gained = d.xp_gained + xp;

    //                 return { ...d, xp_gained: new_xp_gained };
    //             }

    //             return d;
    //         })
    //     );
    }

    const save_deck_xp = async (decks, percentage) => {
    //     let new_levels = [];
    //     decks.forEach(deck => {
    //         let level_gained = 0;

    //         let xp_needed_for_next_level = (deck.level + level_gained) * 100;
    //         let total_xp = deck.xp + (deck.xp_gained * percentage);
    //         while (total_xp >= xp_needed_for_next_level) {
    //             level_gained++;
    //             xp_needed_for_next_level = (deck.level + level_gained) * 100;
    //         }

    //         new_levels.push(level_gained);
    //     });

    //     let account_level_up = 0;
    //     new_levels.forEach(level => {
    //         account_level_up += level;
    //     });

    //     if (account_level_up > 0) {
    //         await levelUpAccount(user.id, account_level_up);
    //     }

    //     const updated_deck_values = decks.map((d, index) => ({
    //        ...d,
    //        level_gained: new_levels[index],
    //        xp: d.xp + d.xp_gained * percentage,
    //        level: (d.level + new_levels[index]),
    //     }))
    //     await levelDecks(updated_deck_values);
    //     return updated_deck_values;
        return decks;
    }

    // TODO: move to /utils?
    const mouse_sensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        },
    });
    const touch_sensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouse_sensor, touch_sensor);

    const handleDragStart = (event) => {
        player_actions.setSelected(event.active.id);
    }

    const handleDragEnd = (event) => {
        const { over } = event;

        if (over) {
            setSelectedMonster(monsters[over.id]);
            setIsAttackModalOpen(true);
        } else {
            player_actions.setSelected(null);
            setSelectedMonster(null);
        }
    }

    const handleSubmitAttack = (answer) => {
        const card_answer = player_actions.getSelectedAnswer();
        const is_correct = answer.toLowerCase() === card_answer || answer.toLowerCase() === "test";

        if (answer && is_correct) {
            const hurt_monsters = monsters.map(mon => mon.id === selected_monster.id ? { ...mon, health: mon.health - player.attack, is_hit: true } : mon);

            setMonsters(hurt_monsters);

            setTimeout(() => {
                setMonsters(prevMonsters => {
                    const unhurt_monsters = prevMonsters.map(mon => ({...mon, is_hit: false }));
                    const updated_monsters = unhurt_monsters.filter(mon => mon.health > 0);
                    if (updated_monsters.length === 0) {
                        setTimeout(() => {
                            setIsRoundEndModalOpen(true);
                        }, 1000);
                    }
                    return updated_monsters;
                });
            }, 800);

            player_actions.playCard(player_actions.getSelected());

            // reward_deck_xp(selected_card.deck_id, selected_monster.xp_reward);
        } else {
            player_actions.hit(selected_monster.attack);
        }

        player_actions.setSelected(null);
        setSelectedMonster(null);
        player_actions.updateStats(is_correct);
    }

    useEffect(() => {
        setTimeout(() => {
            if (player_actions.isDead()) {
                setIsDeathModalOpen(true);
            }
        }, 1000);
    }, [player.health]);

    const handleCloseAttackModal = () => {
        player_actions.setSelected(null);
        setSelectedMonster(null);
        setIsAttackModalOpen(false);
    }

    const handleExit = async (xp_percentage) => {
        if (xp_percentage === 0) {
            onNavigate({name: 'home'});
            return;
        }

        const new_decks = await save_deck_xp(decks, xp_percentage);
        const results = {
            decks: new_decks, // NEW_DECKS THATS HERE DOESN'T HAVE UPDATED XP (IN CASE OF FEE ETC)
            answer_stats: player.answer_stats
        }
        onNavigate({name: 'results', related_object: results});
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full flex flex-col bg-dungeon-dark-900 min-h-screen relative">
                <button className="text-dungeon-red-900 border border-dungeon-red-900 hover:text-dungeon-dark-900 hover:bg-dungeon-red-900 px-2 py-1 rounded-lg absolute top-4 left-4" onClick={() => {setIsEarlyFleeModalOpen(true)}}>{`Flee`}</button>
                {!player_actions.hasCards() ? (
                    <div className="text-white font-bold flex flex-col h-full justify-center text-center">
                        <h1>No cards in decks!</h1>
                        <h2>Please add some cards to your decks and come back.</h2>
                    </div>
                    ) : (
                    <div className="flex flex-col w-full h-full">
                        <Monsters monsters={monsters} />
                        
                        <PlayerUI player={player} player_actions={player_actions} />

                        {isAttackModalOpen && (
                            <AttackModal
                                onClose={handleCloseAttackModal}
                                onSave={handleSubmitAttack}
                                card={player_actions.getCard(player_actions.getSelected())}
                            />
                        )}
                        {isRoundEndModalOpen && (
                            <RoundEndModal
                                onClose={async () => await handleExit(1)}
                                onNext={() => {nextRoom(); setIsRoundEndModalOpen(false);}}
                                round={round}
                            />
                        )}
                        {isEarlyFleeModalOpen && (
                            <EarlyFleeModal
                                onClose={async () => await handleExit(EARLY_FLEE_FEE)}
                                onContinue={() => setIsEarlyFleeModalOpen(false)}
                                fee={EARLY_FLEE_FEE}
                            />
                        )}
                        {isDeathModalOpen && (
                            <DeathModal
                                onExit={async () => await handleExit(0)}
                            />
                        )}
                        <DragOverlay dropAnimation={null}>
                            {player_actions.getSelected() !== null ? (
                                <PlayerCard card={player_actions.getCard(player_actions.getSelected())} fresh={false} />
                            ) : null}
                        </DragOverlay>
                    </div>
                )}
            </div>
        </DndContext>
    )
}