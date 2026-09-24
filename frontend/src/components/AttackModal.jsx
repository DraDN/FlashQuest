import { useState } from "react";
import Modal from "./Modal";
import { shuffle_array } from "../utils/shuffle";

export default function AttackModal({ onClose, onSave, card, isCorrect }) {
    const [ answer, setAnswer ] = useState(card.options.length === 1 ? '' : []);
    const [ grade, setGrade ] = useState(null);
    const [ is_answered, setIsAnswered ] = useState(false);
    const [ is_correct, setIsCorrect ] = useState(false);

    const [ shuffled_options, setShuffledOptions ] = useState(() => {
        if (card.options.length > 1) {
            const options = card.options.map((option, index) => {
                return { text: option, id: index };
            });
            return shuffle_array(options);
        }

        return [];
    })

    const check_answer = () => {
        if (answer.length === 0) {
            alert("Please select at least one answer.");
            return;
        }

        setIsAnswered(true);
        setIsCorrect(isCorrect(answer));
    }

    const send_answer = () => {
        onSave(is_correct, grade);

        setAnswer(null);
        setIsAnswered(false);
        setIsCorrect(false);
        setGrade(null);

        onClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (is_answered) {
            send_answer();
        } else {
            check_answer(e);
        }
    }

    return (
        <>
            <Modal children={
                <div className={``}>
                    <h1 className="text-center text-2xl font-bold text-dungeon-orange-glow mb-2">Attack!</h1>
                    <div className="flex flex-col text-xl text-center text-white gap-1 mb-4">
                        <h2 className="">Question: </h2>
                        <span className="font-bold">{card.question}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-md font-medium text-zinc-400 mb-2"> Answer to attack the monster! </label>

                        {card.options.length === 1 && (
                            <input
                                type="text"
                                disabled={is_answered}
                                onChange={(e) => setAnswer(e.target.value)}
                                className={`w-full text-xl bg-zinc-950 border ${is_answered ? (is_correct ? "border-dungeon-green-200" : "border-dungeon-red-500") : "border-white"} rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors`}
                                required
                                autoFocus
                            />
                        )}

                        <div className="flex flex-col items-center justify-center gap-2">
                            {card.options.length > 1 && shuffled_options.map((option) => (
                                <button 
                                    key={option.id}
                                    type="button"
                                    disabled={is_answered}
                                    className={`w-full text-xl border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors
                                        ${!is_answered && answer.includes(option.id) ? 'bg-dungeon-green-700' : 'bg-zinc-950'}
                                        ${is_answered && 
                                            (answer.includes(option.id) ?
                                                (card.answers.includes(option.id) ? 'border-dungeon-green-200' : 'border-dungeon-red-500') :
                                                (card.answers.includes(option.id) ? 'border-dungeon-orange-glow' : 'border-white'))
                                        }
                                        `}
                                    onClick={() => {
                                        if (answer.includes(option.id)) {
                                            setAnswer(answer.filter(ans => ans !== option.id));
                                        } else {
                                            setAnswer([...answer, option.id]);
                                        }
                                    }}>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        
                        {!is_answered ? (
                            <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                                <button 
                                    type="button"
                                    className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                    onClick={() => { setAnswer(null); onClose(); }}>
                                    
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={answer.length === 0}
                                    className="bg-dungeon-green-700 hover:bg-dungeon-yellow text-white hover:text-dungeon-dark-900">
                                    Answer
                                </button>
                            </div>
                        ) : (
                            <div>
                                {!is_correct && card.options.length === 1 && (
                                    <div className="mb-4">
                                        <p className="text-xl text-center italic">The correct answer is</p>
                                        <p className="text-xl text-center font-bold">{card.options.at(card.answers.at(0))}</p>
                                    </div>
                                )}
                                <p className="text-xl text-center">How hard was the question?</p>
                                <div className={`flex justify-between gap-3 pt-2 *:grow *:py-2 *:rounded-lg *:font-semibold *:text-xl *:transition-colors *:border
                                    ${is_correct ?
                                        "*:border-dungeon-green-700 *:hover:bg-dungeon-green-700" :
                                        "*:border-dungeon-red-900 *:hover:bg-dungeon-red-900"}`}>
                                    <button 
                                        type="submit"
                                        onClick={() => setGrade(is_correct ? 4 : 0)}>
                                        {is_correct ? "Good" : "Again"}
                                    </button>
                                    <button 
                                        type="submit"
                                        onClick={() => setGrade(is_correct ? 5 : 2.5)}>
                                        {is_correct ? "Easy" : "Hard"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            } />
        </>
    );
}