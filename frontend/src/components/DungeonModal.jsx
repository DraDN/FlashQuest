import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { getDecks, getDungeonDecks } from '../services/api';
import Modal from "./Modal";

const MAX_CHARACTERS = 50;

export default function DungeonModal({ onClose, onSave, mode, id, initial_name }) {
    const [dungeonName, setDungeonName] = useState(mode === 'edit' ? initial_name : '');
    const [decks, setDecks] = useState(undefined);
    const [selectedDecksID, setSelectedDecksID] = useState(undefined);
    const { user } = useUser();
    const [ isDeckError, setIsDeckError ] = useState(false);

    useEffect(() => {
        getDecks().then(res => {
            if (res.ok) {
                setDecks(res.data);
            } else {
                setIsDeckError(true);
            }
        });
    });

    useEffect(() => {
        if (mode === 'edit') {
            getDungeonDecks(id)
            .then(res => {
                if (!res.ok) {
                    setIsDeckError(true);
                }

                setSelectedDecksID(res.data.map(d => d.id));
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

    const getDeckState = () => {
        if (isDeckError) {
            return (
                <p className="text-sm text-red-400">Could not load decks</p>
            )
        } else if (!decks || !selectedDecksID) {
            return (
                <p className="text-sm text-zinc-400">Loading decks...</p>
            )
        } else {
            return decks.map((deck) => (
                <div key={deck.id} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedDecksID.includes(deck.id)}
                        onChange={() => handleSelectionChange(deck.id)}
                    />
                    <label>{deck.name}</label>
                </div>
            ));
        }
    }

    if (decks && decks.length === 0) {
        return (
            <Modal children={(
                <div className="w-full max-w-md relative p-6 bg-zinc-900">
                    <h1 className="text-xl font-bold text-white mb-4">No decks to create a dungeon with!</h1>
                    <h3 className="text-xl font-bold text-white mb-4">Please create a deck first</h3>
                </div>
            )} onClose={onClose} />
        )
    }

    return (
        <Modal children={(
            <>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-4">{mode === 'create' ? 'Create New Dungeon' : 'Edit Dungeon'}</h1>

                    <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 space-y-4">
                        <label className="block text-md font-medium text-zinc-400 mb-2"> Dungeon Name </label>
                        <input
                            type="text"
                            value={dungeonName}
                            maxLength={MAX_CHARACTERS}
                            onChange={(e) => setDungeonName(e.target.value)}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-dungeon-yellow transition-colors"
                            required
                        />
                        <div className={`text-xs text-right mt-1 font-mono ${
                            dungeonName.length >= MAX_CHARACTERS
                            ? "text-red-500 font-bold"
                            : "text-zinc-500"
                        }`}>
                            {dungeonName.length}/{MAX_CHARACTERS}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            <label className="lock text-md font-medium text-zinc-400 mb-2"> Select decks to pull flashcards from: </label>
                            {getDeckState()}
                        </div>
                        
                         <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                            <button 
                                type="button"
                                className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                onClick={() => { setDungeonName(''); setSelectedDecksID([]); onClose(); }}>
                                
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="bg-dungeon-green-700 hover:bg-dungeon-yellow text-white hover:text-dungeon-dark-900">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </>
        )} />
    )
}