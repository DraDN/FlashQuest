import { useState } from "react";

import Modal from "./Modal";

const MAX_CHARACTERS = 100;

export default function CardModal({ onClose, onSave, mode, id, initial_value }) {
    const [card, setCard] = useState(mode === 'edit' ? initial_value : { question: '', answer: '' });

    const handleSave = (e) => {
        e.preventDefault();
        if (!card.question.trim() || !card.answer.trim()) return;

        onSave(id, card.question, card.answer);
        setCard({ question: '', answer: '' });
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
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        <div className={`text-xs text-right mt-1 font-mono ${
                            card.question.length >= MAX_CHARACTERS
                            ? "text-red-500 font-bold"
                            : "text-zinc-500"
                        }`}>
                            {card.question.length}/{MAX_CHARACTERS}
                        </div>

                        <label className="block text-md font-medium text-zinc-400 mb-2"> Answer </label>
                        <input
                            type="text"
                            value={card.answer}
                            maxLength={MAX_CHARACTERS}
                            onChange={(e) => setCard({ ...card, answer: e.target.value})}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        <div className={`text-xs text-right mt-1 font-mono ${
                            card.answer.length >= MAX_CHARACTERS
                            ? "text-red-500 font-bold"
                            : "text-zinc-500"
                        }`}>
                            {card.answer.length}/{MAX_CHARACTERS}
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                            <button 
                                type="button"
                                className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                onClick={() => { setCard({ question: '', answer: '' }); onClose(); }}>
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