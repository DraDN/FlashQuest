import { useState, useEffect } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';

import { getDungeonCards, getDungeonDecks, levelDecks } from "../api";
import { PlayerCards, DraggableCard } from "../components/PlayerCards";
import Monsters from "../components/Monsters";

import AttackModal from "../components/AttackModal";

const MAX_NO_MONSTERS = 2;
const MAX_HAND_SIZE = 5;

const shuffle_array = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

let count = 0;

const MONSTER_TEMPLATES = [
    { id: "skeleton", name: "Skeleton" },
    { id: "goblin", name: "Goblin" },
    { id: "orc", name: "Orc" },
]

const TIER_TEMPLATES = [
    { id: "Weak", base_health: 10, base_attack: 5, base_xp: 2 },
    { id: "Normal", base_health: 20, base_attack: 10, base_xp: 4 },
    { id: "Hard", base_health: 30, base_attack: 10, base_xp: 6 },
    { id: "Elite", base_health: 40, base_attack: 15, base_xp: 8 },
    { id: "Boss", base_health: 50, base_attack: 20, base_xp: 10 },
]

const MONSTER_ASSETS = MONSTER_TEMPLATES.map(monster => ({
    name: monster.name,
    image: `/assets/monsters/${monster.id}.png`
}))

const get_room_progression_index = (round) => {
    return ((round - 1) % 10) + 1;
}

const get_monster = (round) => {
    const floor_index = Math.floor((round - 1) / 10);
    const floor_mult = Math.pow(1.3, floor_index);
    const room_pregression_index = get_room_progression_index(round);

    // let tier = "Normal";
    // let base_health = Math.random() * 14 + 10;
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
        xp_reward: xp
    }
}

export default function Dungeon({ dungeon, onNavigate }) {
    const [ cards, setCards ] = useState([]);
    const [ decks, setDecks ] = useState([]);
    const [ round, setRound ] = useState(1);

    const [ selected_card, setSelectedCard ] = useState(null);
    const [ selected_monster, setSelectedMonster ] = useState(null);

    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ player_health, setPlayerHealth ] = useState(100);
    
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
    
    const [ card_state, setCardState ] = useState({
        draw_pile: [],
        hand: [],
        discard_pile: []
    })

    const refill_hand = () => {
        setCardState((previousState) => {
            let current_draw_pile = [...previousState.draw_pile];
            let current_discard_pile = [...previousState.discard_pile];
            let new_hand = [...previousState.hand]

            while (new_hand.length < MAX_HAND_SIZE) {
                if (current_draw_pile.length === 0) {
                    current_draw_pile = shuffle_array(current_discard_pile);
                    current_discard_pile = [];
                }

                const top_card = current_draw_pile.shift();
                new_hand.push(top_card);
            }

            return {
                draw_pile: current_draw_pile,
                hand: new_hand,
                discard_pile: current_discard_pile
            }
        })
    }

    const play_card = (card) => {
        setCardState((previousState) => {
            const new_hand = previousState.hand.filter(c => c.id !== card.id);
            const new_discard_pile = [...previousState.discard_pile, card];

            if (new_hand.length === 0) {
                refill_hand();
            }

            return {
                ...previousState,
                hand: new_hand,
                discard_pile: new_discard_pile
            }
        })
    }

    const nextRoom = () => {
        setRound(round + 1);
        setMonsters(generate_monsters());
        // refill_hand();
        console.log("next room!");
    }

    useEffect(() => {
        getDungeonCards(dungeon.id)
        .then(new_cards => {
            setCards(new_cards);
            // setMonsters(generate_monsters(round));

            setCardState(() => {
                const initial_draw_pile = shuffle_array(new_cards);

                const starting_hand = initial_draw_pile.slice(0, MAX_HAND_SIZE);

                return {
                    draw_pile: initial_draw_pile.slice(MAX_HAND_SIZE),
                    hand: starting_hand,
                    discard_pile: []
                }
            })
        });

        getDungeonDecks(dungeon.id)
        .then(setDecks);
    }, [dungeon, round]);

    const reward_deck_xp = (deck_id, xp) => {
        setDecks((prevDecks) =>
            prevDecks.map((d) => {
                if (d.id === deck_id) {
                    const new_xp = d.xp + xp;
                    const xp_needed_for_next_level = d.level * 100;

                    if (new_xp >= xp_needed_for_next_level) {
                        return {
                            ...d,
                            level: d.level + 1,
                            xp: new_xp - xp_needed_for_next_level,
                        };
                    }

                    return { ...d, xp: new_xp };
                }

                return d;
            })
        );
    }

    const save_deck_xp = async (decks) => {
        await levelDecks(decks);
    }

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
        setSelectedCard(card_state.hand[event.active.id]);
    }

    const handleDragEnd = (event) => {
        const { over } = event;

        if (over) {
            // setSelectedCard(card_state[active.id]);
            setSelectedMonster(monsters[over.id]);
            setIsAttackModalOpen(true);
        } else {
            setSelectedCard(null);
            setSelectedMonster(null);
        }
    }

    const handleSubmitAttack = (answer) => {
        console.log(answer);
        if (answer && (selected_card.answer.toLowerCase() === answer.toLowerCase() || answer.toLowerCase() === "test")) {
            const hurt_monsters = monsters.map(mon => mon.id === selected_monster.id ? { ...mon, health: mon.health - 10 } : mon);
            const updated_monsters = hurt_monsters.filter(mon => mon.health > 0);

            if (updated_monsters.length === 0) {
                // onNavigate('home');
                nextRoom();
                return;
            }

            setMonsters(updated_monsters);
            play_card(selected_card);

            reward_deck_xp(selected_card.deck_id, selected_monster.xp_reward);
        } else {
            setPlayerHealth(player_health - selected_monster.attack);

            if (player_health <= 0) {
                onNavigate('home');
                return;
            }
        }

        setSelectedCard(null);
        setSelectedMonster(null);
    }

    const handleCloseAttackModal = () => {
        setSelectedCard(null);
        setSelectedMonster(null);
        setIsAttackModalOpen(false);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full flex flex-col bg-dungeon-dark-900 min-h-screen relative">
                <button className="text-white absolute top-4 left-4" onClick={async () => {onNavigate('home'); await save_deck_xp(decks);}}>{`<- back`}</button>
                {cards && cards.length === 0 ? (
                    <div className="text-white font-bold flex flex-col h-full justify-center text-center">
                        <h1>No cards in decks!</h1>
                        <h2>Please add some cards to your decks and come back.</h2>
                    </div>
                    ) : (
                    <div className="flex flex-col w-full h-full">
                        <Monsters monsters={monsters} />
                        
                        <div className="space-y-1.5 relative">
                            <div className="w-full">
                                <div className="flex flex-row p-4 bg-linear-to-r from-red-700 to-red-200 transition-all duration-500 ease-out"
                                    style={{ width: `${player_health}%`}}>
                                </div>
                                <p className="text-white absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2">Health: {player_health}</p>
                            </div>
                        </div>
                        <PlayerCards hand={card_state.hand}/>

                        {isAttackModalOpen && (
                            <AttackModal
                                onClose={handleCloseAttackModal}
                                onSave={handleSubmitAttack}
                                card={selected_card}
                            />
                        )}
                        <DragOverlay dropAnimation={null}>
                            {selected_card !== null ? (
                                <DraggableCard card={selected_card} />
                            ) : null}
                        </DragOverlay>
                    </div>
                )}
            </div>
        </DndContext>
    )
}