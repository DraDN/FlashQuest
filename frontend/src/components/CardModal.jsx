import { useState } from "react";

import Modal from "./Modal";

const MAX_CHARACTERS = 100;
const MAX_OPTIONS = 4;
const CARD_TYPE_INPUT = 1;
const CARD_TYPE_MULT_CHOICE = 2;

export default function CardModal({ onClose, onSave, mode, id, initial_value }) {
    const [card, setCard] = useState(mode === 'edit' ? initial_value : { question: '', answer: 0, options: [''] });
    const [ cardType, setCardType ] = useState(() => {
        if (card.options.length > 1) return CARD_TYPE_MULT_CHOICE;
        return CARD_TYPE_INPUT;
    });

    console.log(cardType);

    const handleSave = (e) => {
        e.preventDefault();
        if (!card.question.trim() || card.answer < 0 || card.answer >= card.options.length || card.options.length === 0) return;

        if (cardType === CARD_TYPE_INPUT) {
            card.options = [card.options.at(card.answer)];
            card.answer = 0;
        }

        onSave(id, card.question, card.answer, card.options);
        setCard({ question: '', answer: 0, options: [''] });
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
{/* 
                        {cardType === CARD_TYPE_INPUT && (
                            <>
                                <label className="block text-md font-medium text-zinc-400 mb-2"> Answer </label>
                                <input
                                    type="text"
                                    value={card.options.at(card.answer)}
                                    maxLength={MAX_CHARACTERS}
                                    onChange={(e) => {
                                        const new_options = [...card.options];
                                        new_options[card.answer] = e.target.value;
                                        setCard({ ...card, options: new_options });
                                    }}
                                    className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors"
                                    required
                                />
                                <div className={`text-xs text-right mt-1 font-mono ${
                                    card.answer.length >= MAX_CHARACTERS
                                    ? "text-red-500 font-bold"
                                    : "text-zinc-500"
                                }`}>
                                    {card.options.at(card.answer).length}/{MAX_CHARACTERS}
                                </div>
                            </>
                        )} */}

                        {cardType === CARD_TYPE_INPUT && (
                            <label className="block text-md font-medium text-zinc-400 mb-2"> Answer </label>
                        )}
                        {cardType === CARD_TYPE_MULT_CHOICE && (
                            <label className="block text-md font-medium text-zinc-400 mb-2"> Answers </label>
                        )}

                        {card.options.map((option, index) => {
                            if (cardType === CARD_TYPE_INPUT && index !== card.answer) return null;

                            return (
                            <>
                                <label key={index} className="inline-flex items-center justify-between text-zinc-400 mb-2 w-full">
                                    {cardType === CARD_TYPE_MULT_CHOICE && `${index + 1} - `}
                                    <input
                                        type="text"
                                        value={option}
                                        maxLength={MAX_CHARACTERS}
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
                                            <input
                                                type="checkbox"
                                                checked={index === card.answer}
                                                onChange={() => setCard({ ...card, answer: index })}
                                                className="ml-2"
                                            />
                                            {index !== card.answer && (
                                                <button
                                                    type="button"
                                                    className="ml-2 text-xl border rounded-xl text-center text-dungeon-red-900 border-dungeon-red-900 px-3 py-1 transition-colors hover:bg-dungeon-red-900 hover:text-dungeon-dark-900"
                                                    onClick={() => setCard({ ...card, options: card.options.filter((_, i) => i !== index)})}>
                                                    x
                                                </button>
                                            )}
                                        </>
                                    )}
                                </label>
                                <div className={`text-xs text-right mt-1 font-mono ${
                                    card.answer.length >= MAX_CHARACTERS
                                    ? "text-red-500 font-bold"
                                    : "text-zinc-500"
                                }`}>
                                    {option.length}/{MAX_CHARACTERS}
                                </div>
                            </>
                            );
                        })}

                        {cardType === CARD_TYPE_MULT_CHOICE && card.options.length < MAX_OPTIONS && (
                            <button
                                type="button"
                                className="w-full bg-zinc-950 rounded-lg px-4 py-2 text-dungeon-green-200 border-dungeon-green-200 border-2 text-md font-bold"
                                onClick={() => setCard({ ...card, options: [...card.options, '']})}>
                                    + 
                            </button>
                        )}
                        
                        <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                            <button 
                                type="button"
                                className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                onClick={() => { setCard({ question: '', answer: 0, options: [''] }); onClose(); }}>
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