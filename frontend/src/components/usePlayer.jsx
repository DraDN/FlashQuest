import { useState, useEffect, useCallback, use } from "react";
import { getDungeonCards, getDungeonDecks } from "../utils/api";
import { shuffle_array } from "../utils/shuffle";

const MAX_HAND_SIZE = 5;
const BASE_PLAYER_ATTACK = 10;
const BASE_PLAYER_HEALTH = 100;

export function usePlayer({ dungeon_id }) {
    const [ cards, setCards ] = useState([]);

    const [ selected_card, setSelectedCard ] = useState(null);
    const [ card_state, setCardState ] = useState({
        draw: [],
        hand: [],
        discard: [],
    });

    const [ health, setHealth ] = useState(BASE_PLAYER_HEALTH);
    const [ attack, setAttack ] = useState(BASE_PLAYER_ATTACK);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });

    useEffect(() => {
        getDungeonCards(dungeon_id)
        .then(new_cards => {
            setCards(new_cards);

            setCardState(() => {
                const filled_hand = refillHand({
                    draw: shuffle_array(Array.from(Array(new_cards.length).keys()).map(i => ({ id: i }))),
                    hand: [],
                    discard: [],
                });

                return filled_hand;
            });
        });

        // getDungeonDecks(dungeon_id)
        // .then((decks) => decks.map(d => {
            // return {
                // ...d,
                // level_gained: 0,
                // xp_gained: 0
            // }
        // })).then(setDecks);
    }, [dungeon_id]);

    const setAttackBasedOnLevel = (level) => {
        setAttack(Math.round(BASE_PLAYER_ATTACK * Math.pow(PLAYER_ATTACK_SCALE_FACTOR, level)));
    }

    const refillHand = useCallback((previousState) => {
        let current_draw = [...previousState.draw];
        let current_discard = [...previousState.discard];
        let new_hand = [...previousState.hand]

        const size = current_draw.length + current_discard.length + new_hand.length;
        const limit = Math.min(size, MAX_HAND_SIZE);
        while (new_hand.length < limit) {
            if (current_draw.length === 0) {
                current_draw = shuffle_array(current_discard);
                current_discard = [];
            }

            const card_to_add = current_draw.shift();
            new_hand.push(card_to_add);
        }

        return {
            draw: current_draw,
            hand: new_hand,
            discard: current_discard,
        };
    });

    const playCard = useCallback(() => {
        setCardState((previousState) => {
            const new_discard = [...previousState.discard, selected_card];

            if (new_hand.length === 0) {
                return refillHand({
                    draw: previousState.draw,
                    hand: new_hand,
                    discard: new_discard
                });
            }

            return {
                ...previousState,
                discard: new_discard
            }
        });
    }, [refillHand, card_state, selected_card]);

    const remove_card = (card_id) => {
        setCardState((previousState) => {
            const new_hand = previousState.hand.filter((card) => card.id !== card_id);
            return {
                ...previousState,
                hand: new_hand
            }
        })
    }

    const add_card = (card_id) => {
        setCardState((previousState) => {
            const new_hand = [...previousState.hand, { id: card_id }];
            return {
                ...previousState,
                hand: new_hand
            }
        })
    }

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

    const getCard = useCallback((card_id) => {
        return cards.at(card_id);
    }, [cards]);

    const setSelected = useCallback((card_id) => {
        if (selected_card !== null && card_id !== selected_card) {
            add_card(selected_card);
        }

        if (card_id !== null) {
            remove_card(card_id);
        }

        setSelectedCard(card_id);
    });

    const getSelected = useCallback(() => {
        return selected_card;
    }, [selected_card]);

    const getSelectedAnswer = useCallback(() => {
        return getCard(selected_card).answer.trim().toLowerCase();
    }, [selected_card, getCard]);

    const isDead = useCallback(() => {
        return (health <= 0);
    }, [health]);

    const hasCards = useCallback(() => {
        return (cards && cards.length > 0);
    }, [cards]);

    return {
        player: {
            card_state, health, attack, answer_stats
        },

        player_actions: {
            setAttackBasedOnLevel,
            playCard,
            hit,
            updateStats,
            getCard,
            setSelected,
            getSelected,
            getSelectedAnswer,
            isDead,
            hasCards
        }
    };
}
