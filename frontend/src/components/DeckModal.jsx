import { useState } from "react";

import Modal from "./Modal";

const MAX_CHARACTERS = 50;

export default function DeckModal({ onClose, onSave, mode, id, initial_value }) {
    const [deckName, setDeckName] = useState(mode === 'rename' ? initial_value : '');

    const handleSave = (e) => {
        e.preventDefault();
        if (!deckName.trim()) return;

        onSave(id, deckName);
        setDeckName('');
        onClose();
    };

    return (
        <>
            <Modal children={
                <div>
                    <h1 className="text-xl font-bold text-white mb-4">{mode === 'create' ? 'Create Deck' : 'Rename Deck'}</h1>

                    <form onSubmit={handleSave} className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Deck Name </label>
                        <input
                            type="text"
                            value={deckName}
                            maxLength={MAX_CHARACTERS}
                            onChange={(e) => setDeckName(e.target.value)}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        <div className={`text-xs text-right mt-1 font-mono ${
                            deckName.length >= MAX_CHARACTERS
                            ? "text-red-500 font-bold"
                            : "text-zinc-500"
                        }`}>
                            {deckName.length}/{MAX_CHARACTERS}
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                type="button"
                                className="px-4 py-2 rounded-lg bg-zing-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors"
                                onClick={() => { setDeckName(''); onClose(); }}>
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