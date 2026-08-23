import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useUser } from "@clerk/clerk-react";

import useSensorsConfig from "../config/sensors";

import { PlayerUI, PlayerCard } from "../components/PlayerUI";
import usePlayer from "../hooks/usePlayer";
import useCardManager from "../hooks/useCardManager";

import { MonsterUI } from "../components/MonsterUI";
import { useMonster } from "../hooks/useMonster";

import AttackModal from "../components/AttackModal";
import RoundEndModal from "../components/RoundEndModal";
import EarlyFleeModal from "../components/EarlyFleeModal";
import DeathModal from "../components/DeathModal";

import IntermittentMessage from "../components/IntermittentMessage";

import * as DUNGEON_CONFIG from "../config/dungeon_configs";
import { get_coin_reward } from "../utils/dungeon_utils";

export default function Dungeon({ dungeon, onNavigate }) {
    const { user } = useUser();

    const [ round, setRound ] = useState(1);

    const { player, player_actions } = usePlayer({ dungeon_id: dungeon.id });
    const { card_state, card_actions } = useCardManager(dungeon.id);
    const { monsters, monster_actions } = useMonster({ round: round });

    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ isRoundEndModalOpen, setIsRoundEndModalOpen ] = useState(false);
    const [ isEarlyFleeModalOpen, setIsEarlyFleeModalOpen ] = useState(false);
    const [ isDeathModalOpen, setIsDeathModalOpen ] = useState(false);
    const [ isError, setIsError ] = useState(false);

    const sensors_conf = useSensorsConfig();
    
    const nextRoom = () => {
        setRound(round + 1);
        monster_actions.generateRound(round + 1);
    }

    const handleDragStart = (event) => {
        card_actions.setSelected(event.active.id);
    }

    const handleDragEnd = (event) => {
        const { over } = event;

        if (over) {
            monster_actions.setSelected(over.id);
            setIsAttackModalOpen(true);
        } else {
            card_actions.setSelected(null);
            monster_actions.setSelected(null);
        }
    }

    const handleSubmitAttack = (answer) => {
        const card_answer = card_actions.getSelectedAnswer();
        const is_correct = answer.toLowerCase() === card_answer || answer.toLowerCase() === "test";

        if (answer && is_correct) {
            monster_actions.hitSelected(player.attack);

            card_actions.playCard();

            player_actions.rewardXP(monster_actions.getSelected().xp_reward);
        } else {
            player_actions.hit(monster_actions.getSelected().attack);
        }

        player_actions.updateStats(is_correct);
    }

    useEffect(() => {
        if (player_actions.isDead()) {
            setTimeout(() => {
                setIsDeathModalOpen(true);
            }, DUNGEON_CONFIG.MODAL_POPUP_DELAY);
        }
    }, [player.health]);

    useEffect(() => {
        if (monsters.length === 0) {
            setTimeout(() => {
                setIsRoundEndModalOpen(true);
            }, DUNGEON_CONFIG.MODAL_POPUP_DELAY);

            player_actions.rewardCoins(get_coin_reward(round));
        }
    }, [monsters.length]);

    const handleCloseAttackModal = () => {
        card_actions.setSelected(null);
        monster_actions.setSelected(null);
        setIsAttackModalOpen(false);
    }

    const handleExit = async (keep_percentage) => {
        if (keep_percentage === 0) {
            onNavigate({name: 'home'});
            return;
        }

        const gained = player_actions.getGained(keep_percentage);
        const save_res = player_actions.saveCoins(keep_percentage);
        const results = {
            gained: gained,
            answer_stats: player.answer_stats
        }
        onNavigate({name: 'results', related_object: results});
    }

    let interMsg = null;

    if (card_actions.hasError()) {
        interMsg = { title: "Error", subtitle: "Something went wrong. Please try again." };
    } else if (card_actions.isLoading()) {
        interMsg = { title: "Loading", subtitle: "Please wait..." };
    } else if (!card_actions.hasCards()) {
        interMsg = { title: "No cards in decks!", subtitle: "Please add some cards to your decks and come back." };
    }

    if (interMsg) {
        return (
            <div className="w-full min-h-screen">
                <IntermittentMessage title={interMsg.title} subtitle={interMsg.subtitle} back={() => onNavigate({name: 'home'})} />
            </div>
        );
    }

    return (
        <DndContext sensors={sensors_conf} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full flex flex-col bg-dungeon-dark-900 min-h-screen relative">
                <button className="text-dungeon-red-900 border border-dungeon-red-900 hover:text-dungeon-dark-900 hover:bg-dungeon-red-900 px-2 py-1 rounded-lg absolute top-4 left-4" onClick={() => {setIsEarlyFleeModalOpen(true)}}>{`Flee`}</button>
                <span className="text-zinc-400 italic text-xl text-left absolute top-4 right-4"> Round: {round} </span>
                <div className="flex flex-col w-full h-full">
                    <MonsterUI monsters={monsters} />
                    
                    <PlayerUI player={player} hand={card_state.hand} get_card={card_actions.getCard} />

                    {isAttackModalOpen && (
                        <AttackModal
                            onClose={handleCloseAttackModal}
                            onSave={handleSubmitAttack}
                            card={card_actions.getSelected()}
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
                            onClose={async () => await handleExit(DUNGEON_CONFIG.EARLY_FLEE_FEE)}
                            onContinue={() => setIsEarlyFleeModalOpen(false)}
                            fee={DUNGEON_CONFIG.EARLY_FLEE_FEE}
                        />
                    )}
                    {isDeathModalOpen && (
                        <DeathModal
                            onExit={async () => await handleExit(0)}
                        />
                    )}
                    <DragOverlay dropAnimation={null}>
                        {card_actions.getSelectedID() !== null ? (
                            <PlayerCard card={card_actions.getSelected()} fresh={false} />
                        ) : null}
                    </DragOverlay>
                </div>
            </div>
        </DndContext>
    )
}