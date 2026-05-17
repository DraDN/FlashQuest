import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { getDecks, getDungeonDecks } from '../api';

export default function DungeonModal({ onClose, onSave, mode, id, initial_name }) {
    const [dungeonName, setDungeonName] = useState(mode === 'edit' ? initial_name : '');
    const [decks, setDecks] = useState([]);
    const [selectedDecksID, setSelectedDecksID] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        getDecks(user.id).then(setDecks);
    }, [user?.id]);

    useEffect(() => {
        if (mode === 'edit') {
            getDungeonDecks(id)
            .then(decks => {
                setSelectedDecksID(decks.map(d => d.id));
            });
        }
    }, [mode, id]);
    
    const handleSelectionChange = (deckID) => {
        if (selectedDecksID.includes(deckID)) {
            setSelectedDecksID(selectedDecksID.filter(id => id !== deckID));
        } else {
            setSelectedDecksID([...selectedDecksID, deckID]);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!dungeonName.trim()) return;
        if (selectedDecksID.length === 0) {
            alert("Please select at least one deck.");
            return;
        }

        onSave(id, dungeonName, selectedDecksID);
        setDungeonName('');
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                {decks && ( 
                <div className="w-full max-w-md relative p-6 bg-zinc-900">
                    <h1 className="text-xl font-bold text-white mb-4">{mode === 'create' ? 'Create New Dungeon' : 'Edit Dungeon'}</h1>

                    <form onSubmit={handleSave} className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Dungeon Name </label>
                        <input
                            type="text"
                            value={dungeonName}
                            onChange={(e) => setDungeonName(e.target.value)}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />

                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Select decks to pull flashcards from: </label>
                        {decks.length === 0 ? (
                            <p className="text-sm text-zinc-400">No decks found.</p>
                        ) : (decks.map((d) => (
                            <div key={d.id} className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedDecksID.includes(d.id)} onChange={() => handleSelectionChange(d.id)} />
                                <label htmlFor={d.id}>{d.name}</label>
                            </div>
                        ))
                        )}
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                type="button"
                                className="px-4 py-2 rounded-lg bg-zing-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors"
                                onClick={() => { setDungeonName(''); setSelectedDecksID([]); onClose(); }}>
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
                )}
                {!decks && (
                    <div className="w-full max-w-md relative p-6 bg-zinc-900">
                        <h1 className="text-xl font-bold text-white mb-4">No decks to create a dungeon with!</h1>
                        <h3 className="text-xl font-bold text-white mb-4">Please create a deck first</h3>
                    </div>
                )}
            </div>
        </>
    );
}