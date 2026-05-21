import { useState, useEffect } from "react";
import { getDungeonCards } from "../api";

import AttackModal from "../components/AttackModal";

const MAX_HAND_SIZE = 5;

const draw_random_hand = (all_cards) => {
    if (!all_cards || all_cards.length === 0) return [];

    const deck_copy = [...all_cards];

    for (let i = deck_copy.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck_copy[i], deck_copy[j]] = [deck_copy[j], deck_copy[i]];
    }

    console.log(deck_copy.slice(0, MAX_HAND_SIZE));
    return deck_copy.slice(0, MAX_HAND_SIZE);
}

let count = 0;

const get_monster = () => {
    return {
        id: count++,
        name: "Monster " + count,
        health: parseInt(Math.random() * 20),
        attack: parseInt(Math.random() * 10),
        color: Math.random() * 10
    }
}

export default function Dungeon({ dungeon, onNavigate }) {
    const [ cards, setCards ] = useState([]);
    const [ selected_card, setSelectedCard ] = useState(null);
    const [ selected_monster, setSelectedMonster ] = useState(null);
    const [ hand, setHand ] = useState([]);
    const [ monsters, setMonsters ] = useState([]);
    const [ isAttackModalOpen, setIsAttackModalOpen ] = useState(false);
    const [ player_health, setPlayerHealth ] = useState(100);

    useEffect(() => {
        getDungeonCards(dungeon.id)
        .then(new_cards => {
            setCards(new_cards);
            setHand(draw_random_hand(new_cards));

            const new_monsters = [];
            for (let i = 0; i < 3; i++) {
                new_monsters.push(get_monster());
            }
            setMonsters(new_monsters);
        });
    }, [dungeon]);

    const handleDragStart = (e, card) => {
        setSelectedCard(card);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, mon) => {
        e.preventDefault();
        
        if (!selected_card) return;

        console.log(mon);
        console.log(selected_card);
        setSelectedMonster(mon);
        // setSelectedCard(null);
        setIsAttackModalOpen(true);
    };

    const handleSubmitAttack = (answer) => {
        console.log(answer);
        if (answer && (selected_card.answer === answer || answer === "test")) {
            const hurt_monsters = monsters.map(mon => mon.id === selected_monster.id ? { ...mon, health: mon.health - 10 } : mon);
            const updated_monsters = hurt_monsters.filter(mon => mon.health > 0);
            if (updated_monsters.length === 0) {
                onNavigate('home');
                return;
            }
            setMonsters(updated_monsters);
            setHand(hand.filter(c => c.id !== selected_card.id));
        } else {
            setPlayerHealth(player_health - 10);

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
        <>
            <div className="w-full flex flex-col bg-dungeon-dark-900 min-h-screen relative">
                <button className="text-white absolute top-4 left-4" onClick={() => onNavigate('home')}>{`<- back`}</button>
                {cards && cards.length === 0 ? (
                    <div className="text-white font-bold flex flex-col h-full justify-center text-center">
                        <h1>No cards in decks!</h1>
                        <h2>Please add some cards to your decks and come back.</h2>
                    </div>
                    ) : (
                    <div className="flex flex-col w-full h-full">
                        <div className="flex flex-row grow gap-4 p-4 items-center justify-center flex-wrap bg-red-100">
                            {monsters.map(mon => (
                                <div key={mon.id} className="w-40 md:h-1/2 h-1/3 text-center space-y-2"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, mon)}>
                                    <div className="h-full bg-white p-4 text-center rounded-xl">
                                    </div>
                                    <p>Health: {mon.health}</p>
                                    <p>{mon.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1.5 relative">
                            <div className="w-full">
                                <div className="flex flex-row p-4 bg-linear-to-r from-red-700 to-red-200 transition-all duration-500 ease-out"
                                    style={{ width: `${player_health}%`}}>
                                </div>
                                <p className="text-white absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2">Health: {player_health}</p>
                            </div>
                        </div>
                        <div className="flex flex-row flex-wrap min-h-1/3 gap-4 p-4 md:items-center justify-center bg-red-400 overflow-clip">
                            {hand.map(c => (
                                <div key={c.id} className={`${(selected_card && c.id === selected_card.id) ? "bg-dungeon-yellow" : "bg-white"} p-4 w-40 md:h-3/4 text-center font-bold text-lg rounded-xl`}
                                    onDragStart={(e) => handleDragStart(e, c)}
                                    draggable={true}>
                                    {/* // onClick={() => setSelectedCard(c)}> */}
                                    <p>{c.question}</p>
                                </div>
                            ))}
                        </div>

                        {/* <h1>Dungeon {dungeon.name}</h1>
                        <button onClick={() => onNavigate('home')}>go back</button>

                        <div>
                            {hand.map(c => (
                                <div key={c.id}>
                                    <p>{c.question}</p>
                                    <p>{c.answer}</p>
                                </div>
                            ))}
                        </div> */}

                        {isAttackModalOpen && (
                            <AttackModal
                                onClose={handleCloseAttackModal}
                                onSave={handleSubmitAttack}
                                card={selected_card}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    )
}