import { useState, useEffect, useCallback, useRef } from "react";
import { getDungeonCards, gradeCards } from "../services/api";

import * as PLAYER_CONFIG from "../config/player_configs";
import { shuffle_array } from "../utils/shuffle";
import { GRADES } from "../utils/sr_algorithm";

function useCardManager(dungeon_id) {
    const [ cards, setCards ] = useState(undefined);

    const [ selected_card, setSelectedCard ] = useState(null);
    const selected_card_ref = useRef(null);
    const [ card_state, setCardState ] = useState({
        due_draw: [],
        review_draw: [],
        hand: [],
    });
    const [ grades, setGrades ] = useState([]);

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
                let due_cards = [];
                let review_cards = [];
                let id = 0;

                new_cards.forEach(card => {
                    const current_time = Date.now();
                    const time_diff = current_time - Date.parse(card.due);

                    const id_card = { id: id++ };

                    if (time_diff <= 0) {
                        review_cards.push({...id_card, due: false});
                    } else {
                        due_cards.push({...id_card, due: true});
                    }
                });

                const filled_hand = refillHand({
                    due_draw: shuffle_array(due_cards),
                    review_draw: review_cards.sort((a, b) => (Date.parse(a.due) - Date.parse(b.due))),
                    hand: [],
                });

                return filled_hand;
            });
        });
    }, [dungeon_id]);

    // === HAND LOGIC ===

    const refillHand = useCallback((previousState) => {
        let current_due_draw = [...previousState.due_draw];
        let current_review_draw = [...previousState.review_draw];
        let new_hand = [...previousState.hand]

        const size = current_due_draw.length + current_review_draw.length + new_hand.length;
        const limit = Math.min(size, PLAYER_CONFIG.MAX_HAND_SIZE);
        while (new_hand.length < limit) {
            let card_to_add;

            if (current_due_draw.length === 0) {
                card_to_add = current_review_draw.shift();
            } else {
                card_to_add = current_due_draw.shift();
            }

            new_hand.push(card_to_add);
        }

        const new_state = {
            due_draw: current_due_draw,
            review_draw: current_review_draw,
            hand: new_hand
        };

        return new_state;
    });

    const playCard = useCallback((grade) => {
        setCardState((previousState) => {
            let new_review = [...previousState.review_draw];
            let new_due = [...previousState.due_draw];

            if (grade === GRADES.AGAIN) {
                new_due.push({ id: selected_card, due: false });
            } else {
                new_review.push({ id: selected_card, due: false });
            }

            if (previousState.hand.length === 0) {
                return refillHand({
                    due_draw: new_due,
                    review_draw: new_review,
                    hand: []
                });
            }

            return {
                ...previousState,
                due_draw: new_due,
                review_draw: new_review
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


    const getCard = useCallback((card_id) => {
        // TODO: add check for card id boundary
        return cards?.at(card_id);
    }, [cards]);

    // === SELECTED CARD ===

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

    const isCorrect = useCallback((answer) => {
        const selected = getSelected();

        if (selected === null) {
            return false;
        }

        if (selected.options.length === 1) { // input field answer
            return (answer.trim().toLowerCase() === selected.options.at(selected.answers.at(0)).trim().toLowerCase()) ||
                    (answer.trim().toLowerCase() === "test");

        } else if (answer.length !== selected.answers.length) { // multiple choice -- wrong amount selected / easy check
            return false;
        } else { // multiple choice -- check if all answers are correct
            return answer.every((answer) => selected.answers.includes(answer));
        }
    }, [getSelected]);

    // === SR ALGO ===

    // const gradeSelected = useCallback((grade) => {
    //     const selected = getSelected();
    //     const [new_repetitions, new_easy_factor, new_interval] = sr_algorithm(grade, selected.repetitions, selected.easy_factor, selected.interval);

    //     setCards((previousState) => {
    //         const new_cards = [...previousState];
    //         new_cards[selected_card] = { ...selected,
    //             repetitions: new_repetitions,
    //             easy_factor: new_easy_factor,
    //             interval: new_interval };
    //         return new_cards;
    //     })
    // }, [getSelected, sr_algorithm]);
    const gradeSelected = useCallback((grade) => {
        const selected = getSelected();
        
        setGrades((prevGrades) => {
            const previous_grades = [...prevGrades]
            if (!previous_grades.find(p_grade => p_grade.id === selected.id)) {
                return [...previous_grades, {
                    id: selected.id,
                    grade: grade
                }];
            }
        });
    });

    // const sendGrades = useCallback(() => {
    //     const only_graded = cards.filter((card) => card.interval !== undefined);

    //     if (only_graded.length === 0) {
    //         return;
    //     }

    //     const only_grades = only_graded.map((card) => {
    //         return {
    //             id: card.id,
    //             repetitions: card.repetitions,
    //             easy_factor: card.easy_factor,
    //             interval: card.interval
    //         }
    //     });

    //     return gradeCards(only_grades);
    // }, [cards]);

    const sendGrades = useCallback(() => {
        console.log(grades);
        return gradeCards(grades);
    });

    // === STATE ===

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
        card_state,

        card_actions: {
            playCard,
            setSelected,
            getCard,
            getSelected,
            getSelectedID,
            isCorrect,
            gradeSelected,
            sendGrades,
            hasCards,
            isLoading,
            hasError
        }
    }
}

export default useCardManager;