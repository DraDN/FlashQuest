import { useState } from "react";

import Modal from "./Modal";

const MAX_CHARACTERS = 100;
const MAX_OPTIONS = 4;
const CARD_TYPE_INPUT = 1;
const CARD_TYPE_MULT_CHOICE = 2;

export default function CardModal({ onClose, onSave, mode, id, initial_value }) {
    const [ card, setCard ] = useState(mode === 'edit' ? initial_value : { question: '', answers: [0], options: [''] });
    const [ cardType, setCardType ] = useState(() => {
        if (card.options.length > 1) return CARD_TYPE_MULT_CHOICE;
        return CARD_TYPE_INPUT;
    });

    const handleSave = (e) => {
        e.preventDefault();
        if (card.answers.length === 0) {
            alert("Please select at least one answer. \nYou can do this by clicking on the green checkbox next to the answer.");
            return;
        }

        if (!card.question.trim() || card.answers.length === 0 || card.answers.legnth >= card.options.length || card.options.length === 0) return;

        if (cardType === CARD_TYPE_INPUT) {
            card.options = [card.options.at(card.answers.at(0) -1)];
            card.answers = [card.answers.at(0)];
        }

        onSave(id, card.question, card.answers, card.options);
        setCard({ question: '', answers: [0], options: [''] });
        onClose();
    }

    return (
        <>
            <Modal children={
                <div>
                    <h1 className="text-2xl font-bold text-white mb-4">{mode === 'create' ? 'Create Card' : 'Edit Card'}</h1>

                    <form onSubmit={handleSave} className="space-y-4">
                        <label className="block text-md font-medium text-zinc-400 mb-2"> Question </label>
                        <input
                            type="text"
                            value={card.question}
                            maxLength={MAX_CHARACTERS}
                            onChange={(e) => setCard({ ...card, question: e.target.value})}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors"
                            required
                        />
                        <div className={`text-xs text-right mt-1 font-mono ${
                            card.question.length >= MAX_CHARACTERS
                            ? "text-red-500 font-bold"
                            : "text-zinc-500"
                        }`}>
                            {card.question.length}/{MAX_CHARACTERS}
                        </div>

                        <label className="block text-md font-medium text-zinc-400 mb-2"> Type </label>
                        <select value={cardType} onChange={(e) => setCardType(parseInt(e.target.value))} className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors">
                            <option value={CARD_TYPE_INPUT}>Input Field</option>
                            <option value={CARD_TYPE_MULT_CHOICE}>Multiple Choice</option>
                        </select>

                        {cardType === CARD_TYPE_INPUT && (
                            <label className="block text-md font-medium text-zinc-400 mb-2"> Answer </label>
                        )}
                        {cardType === CARD_TYPE_MULT_CHOICE && (
                            <label className="block text-md font-medium text-zinc-400 mb-2"> Answers </label>
                        )}

                        {card.options.map((option, index) => {
                            if (cardType === CARD_TYPE_INPUT && !card.answers.includes(index)) return null;

                            return (
                            <div key={index}>
                                <label className="inline-flex items-center justify-between text-zinc-400 mb-2 w-full">
                                    {cardType === CARD_TYPE_MULT_CHOICE && `${index + 1} - `}
                                    <input
                                        type="text"
                                        value={option}
                                        maxLength={MAX_CHARACTERS}
                                        rows={1}
                                        onChange={(e) => {
                                            const new_options = [...card.options];
                                            new_options[index] = e.target.value;
                                            setCard({ ...card, options: new_options });
                                        }}
                                        className="grow bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors"
                                        required
                                    />
                                    {cardType === CARD_TYPE_MULT_CHOICE && (
                                        <>
                                            <label className="flex items-center relative">
                                                <input
                                                    type="checkbox"
                                                    checked={card.answers.includes(index)}
                                                    onChange={() => {
                                                        if (card.answers.includes(index)) {
                                                            setCard({ ...card, answers: card.answers.filter((answer) => answer !== index) });
                                                        } else {
                                                            setCard({ ...card, answers: [...card.answers, index] });
                                                        }
                                                    }}
                                                    className="peer cursor-pointer appearance-none w-8 h-8 ml-2 border-2 rounded-xl border-dungeon-green-200 checked:border-dungeon-green-700 checked:bg-dungeon-green-200 hover:border-dungeon-yellow-glow transition-colors"
                                                />
                                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </span>
                                            </label>

                                            <button
                                                type="button"
                                                className="ml-2 cursor-pointer text-xl border rounded-xl text-center text-dungeon-red-900 border-dungeon-red-900 px-1 py-1 transition-colors hover:bg-dungeon-red-900 hover:text-dungeon-dark-900"
                                                onClick={() => setCard({ ...card, options: card.options.filter((_, i) => i !== index)})}>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </span>
                                            </button>
                                        </>
                                    )}
                                </label>
                                <div className={`text-xs text-right mt-1 font-mono ${
                                    card.options.at(index).length >= MAX_CHARACTERS
                                    ? "text-red-500 font-bold"
                                    : "text-zinc-500"
                                }`}>
                                    {option.length}/{MAX_CHARACTERS}
                                </div>
                            </div>
                            );
                        })}

                        {cardType === CARD_TYPE_MULT_CHOICE && card.options.length < MAX_OPTIONS && (
                            <button
                                type="button"
                                className="w-full bg-zinc-950 rounded-lg px-4 py-2 text-dungeon-green-200 border-dungeon-green-200 border-2 text-md font-bold hover:bg-dungeon-yellow-glow hover:text-dungeon-dark-900 hover:border-dungeon-yellow transition-colors"
                                onClick={() => setCard({ ...card, options: [...card.options, '']})}>
                                    + 
                            </button>
                        )}
                        
                        <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                            <button 
                                type="button"
                                className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                onClick={() => { setCard({ question: '', answers: 1, options: [''] }); onClose(); }}>
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="bg-dungeon-green-700 hover:bg-dungeon-yellow hover:text-dungeon-dark-900 text-white">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            } />
        </>
    );
}