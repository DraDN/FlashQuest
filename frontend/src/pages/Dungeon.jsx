import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useUser } from "@clerk/clerk-react";

import { getDungeonCards, getDungeonDecks, levelDecks, levelUpAccount, getAccountLevel } from "../utils/api";

import { PlayerUI, PlayerCard } from "../components/PlayerUI";
import { usePlayer } from "../components/usePlayer";

import { MonsterUI } from "../components/MonsterUI";
import { useMonster } from "../components/useMonster";

import AttackModal from "../components/AttackModal";
import RoundEndModal from "../components/RoundEndModal";
import EarlyFleeModal from "../components/EarlyFleeModal";
import DeathModal from "../components/DeathModal";

const EARLY_FLEE_FEE = 0.6;

export default function Dungeon({ dungeon, onNavigate }) {
    const { user } = useUser();

    const [ decks, setDecks ] = useState([]);
    const [ round, setRound ] = useState(1);

    const { player, player_actions } = usePlayer({ dungeon_id: dungeon.id });
    const { monsters, monster_actions } = useMonster({ round: round });

    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ isRoundEndModalOpen, setIsRoundEndModalOpen ] = useState(false);
    const [ isEarlyFleeModalOpen, setIsEarlyFleeModalOpen ] = useState(false);
    const [ isDeathModalOpen, setIsDeathModalOpen ] = useState(false);
    
    const nextRoom = () => {
        setRound(round + 1);
        monster_actions.generateRound(round + 1);
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
            monster_actions.setSelected(over.id);
            setIsAttackModalOpen(true);
        } else {
            player_actions.setSelected(null);
            monster_actions.setSelected(null);
        }
    }

    const handleSubmitAttack = (answer) => {
        const card_answer = player_actions.getSelectedAnswer();
        const is_correct = answer.toLowerCase() === card_answer || answer.toLowerCase() === "test";

        if (answer && is_correct) {
            monster_actions.hitSelected(player.attack);

            player_actions.playCard();

            // reward_deck_xp(selected_card.deck_id, selected_monster.xp_reward);
        } else {
            player_actions.hit(monster_actions.getAttackSelected());
        }

        player_actions.updateStats(is_correct);
    }

    useEffect(() => {
        setTimeout(() => {
            if (player_actions.isDead()) {
                setIsDeathModalOpen(true);
            }
        }, 1000);
    }, [player.health]);

    useEffect(() => {
        setTimeout(() => {
            if (monsters.length === 0) {
                setIsRoundEndModalOpen(true);
            }
        }, 1000);
    }, [monsters.length]);

    const handleCloseAttackModal = () => {
        player_actions.setSelected(null);
        monster_actions.setSelected(null);
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
                        <MonsterUI monsters={monsters} />
                        
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