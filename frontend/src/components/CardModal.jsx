import { useState } from "react";

import Modal from "./Modal";

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
                    <h1 className="text-xl font-bold text-white mb-4">{mode === 'create' ? 'Create Card' : 'Edit Card'}</h1>

                    <form onSubmit={handleSave} className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Question </label>
                        <input
                            type="text"
                            value={card.question}
                            onChange={(e) => setCard({ ...card, question: e.target.value})}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />

                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Answer </label>
                        <input
                            type="text"
                            value={card.answer}
                            onChange={(e) => setCard({ ...card, answer: e.target.value})}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                type="button"
                                className="px-4 py-2 rounded-lg bg-zing-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors"
                                onClick={() => { setCard({ question: '', answer: '' }); onClose(); }}>
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-900/20">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            } />
        </>
    );
}