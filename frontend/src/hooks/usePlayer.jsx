import { useState, useEffect, useCallback, useRef } from "react";
import { getDungeonCards, getDungeonDecks, getAccountLevel } from "../services/api";
import { shuffle_array } from "../utils/shuffle";

import * as PLAYER_CONFIG from "../config/player_configs";
import { calculate_stat } from "../utils/player_utils";

export function usePlayer({ dungeon_id }) {
    const [ cards, setCards ] = useState(undefined);

    const [ selected_card, setSelectedCard ] = useState(null);
    const selected_card_ref = useRef(null);
    const [ card_state, setCardState ] = useState({
        draw: [],
        hand: [],
        discard: [],
    });

    const [ health, setHealth ] = useState(PLAYER_CONFIG.BASE_PLAYER_HEALTH);
    const [ attack, setAttack ] = useState(PLAYER_CONFIG.BASE_PLAYER_ATTACK);

    const [ answer_stats, setAnswerStats ] = useState({ correct: 0, incorrect: 0 });

    const [ isError, setIsError ] = useState(false);

    useEffect(() => {
        getDungeonCards(dungeon_id)
        .then(res => {
            if (!res.ok) {
                setIsError(true);
                return;
            }

            const new_cards = res.data;
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

        getAccountLevel().then(res => {
            if (!res.ok) {
                setIsError(true);
                return;
            }

            setAttack(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_ATTACK, res.data.level));
            setHealth(calculate_stat(PLAYER_CONFIG.BASE_PLAYER_HEALTH, res.data.level));
        })
    }, [dungeon_id]);

    const refillHand = useCallback((previousState) => {
        let current_draw = [...previousState.draw];
        let current_discard = [...previousState.discard];
        let new_hand = [...previousState.hand]

        const size = current_draw.length + current_discard.length + new_hand.length;
        const limit = Math.min(size, PLAYER_CONFIG.MAX_HAND_SIZE);
        while (new_hand.length < limit) {
            if (current_draw.length === 0) {
                current_draw = shuffle_array(current_discard);
                current_discard = [];
            }

            const card_to_add = current_draw.shift();
            new_hand.push(card_to_add);
        }

        const new_state = {
            draw: current_draw,
            hand: new_hand,
            discard: current_discard,
        };

        return new_state;
    });

    const playCard = useCallback(() => {
        setCardState((previousState) => {
            const new_discard = [...previousState.discard, { id: selected_card } ];

            if (previousState.hand.length === 0) {
                return refillHand({
                    draw: previousState.draw,
                    hand: [],
                    discard: new_discard
                });
            }

            return {
                ...previousState,
                discard: new_discard
            }
        });

        setSelectedCard(null);
        selected_card_ref.current = null;
    }, [refillHand, card_state, selected_card, selected_card_ref]);

    const remove_card_from_hand = (card_id) => {
        // TODO: add check for card id boundary
        setCardState((previousState) => {
            const new_hand = previousState.hand.filter((card) => card.id !== card_id);
            return {
                ...previousState,
                hand: new_hand
            }
        })
    }

    const add_card_to_hand = (card_id) => {
        // TODO: add check for card id boundary
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
        // TODO: add check for card id boundary
        return cards?.at(card_id);
    }, [cards]);

    const setSelected = useCallback((card_id) => {
        // TODO: add check for card id boundary
        // if we already have a card selected, put it back
        if (selected_card_ref.current !== null && card_id !== selected_card_ref.current) {
            add_card_to_hand(selected_card_ref.current);
        }

        // if we select a new card, move it from hand to "selected"
        if (card_id !== null) {
            remove_card_from_hand(card_id);
        }

        setSelectedCard(card_id);
        selected_card_ref.current = card_id;
    }, [selected_card_ref.current, add_card_to_hand, remove_card_from_hand]);

    const getSelectedID = useCallback(() => {
        return selected_card;
    }, [selected_card]);

    const getSelected = useCallback(() => {
        return getCard(selected_card);
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

    const isLoading = useCallback(() => {
        return (cards === undefined);
    }, [cards]);

    const hasError = useCallback(() => {
        return isError;
    }, [isError]);

    return {
        player: {
            card_state, health, attack, answer_stats
        },

        player_actions: {
            playCard,
            hit,
            updateStats,
            getCard,
            setSelected,
            getSelectedID,
            getSelected,
            getSelectedAnswer,
            isDead,
            hasCards,
            isLoading,
            hasError
        }
    };
}
