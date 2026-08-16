import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useUser } from "@clerk/clerk-react";

import { getAccountLevel } from "../utils/api";

import useSensorsConfig from "../utils/sensors";

import { PlayerUI, PlayerCard } from "../components/PlayerUI";
import { usePlayer } from "../components/usePlayer";

import { MonsterUI } from "../components/MonsterUI";
import { useMonster } from "../components/useMonster";

import { useXPManager } from "../components/useXPManager";

import AttackModal from "../components/AttackModal";
import RoundEndModal from "../components/RoundEndModal";
import EarlyFleeModal from "../components/EarlyFleeModal";
import DeathModal from "../components/DeathModal";

const EARLY_FLEE_FEE = 0.6;

export default function Dungeon({ dungeon, onNavigate }) {
    const { user } = useUser();

    const [ round, setRound ] = useState(1);

    const { player, player_actions } = usePlayer({ dungeon_id: dungeon.id });
    const { monsters, monster_actions } = useMonster({ round: round });

    const { xp_actions } = useXPManager({ dungeon_id: dungeon.id });

    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ isRoundEndModalOpen, setIsRoundEndModalOpen ] = useState(false);
    const [ isEarlyFleeModalOpen, setIsEarlyFleeModalOpen ] = useState(false);
    const [ isDeathModalOpen, setIsDeathModalOpen ] = useState(false);

    const sensors_conf = useSensorsConfig();
    
    const nextRoom = () => {
        setRound(round + 1);
        monster_actions.generateRound(round + 1);
    }

    // maybe move to usePlayer?
    useEffect(() => {
        getAccountLevel().then((level) => {
            player_actions.setAttackBasedOnLevel(level.level);
        });
    });

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

            xp_actions.rewardXPToDeck(player_actions.getSelected().deck_id, monster_actions.getSelected().xp_reward);
        } else {
            player_actions.hit(monster_actions.getSelected().attack);
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

        const new_decks = await xp_actions.save(xp_percentage);
        const results = {
            decks: new_decks, // NEW_DECKS THATS HERE DOESN'T HAVE UPDATED XP (IN CASE OF FEE ETC)
            answer_stats: player.answer_stats
        }
        onNavigate({name: 'results', related_object: results});
    }

    return (
        <DndContext sensors={sensors_conf} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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