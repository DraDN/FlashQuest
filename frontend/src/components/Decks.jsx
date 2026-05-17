import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import { getDecks, createDeck, renameDeck, deleteDeck } from '../api';

import DeckModal from './DeckModal';

export default function Decks({ onDeckSelect }) {
    const { user } = useUser();
    const [ decks, setDecks ] = useState([]);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", deck_id: null, initial_value: "" });

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", deck_id: null, initial_value: "" });
    }

    const openRenameModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "rename", deck_id: id, initial_value: name });
    }

    useEffect(() => {
        getDecks(user.id).then(setDecks);
    }, [user?.id]);

    const handleDeckCreation = async (name) => {
        const new_deck = await createDeck(user.id, name);
        setDecks([...decks, new_deck]);
    }

    const handleDeckRename = async (id, name) => {
        const renamed_deck = await renameDeck(id, name);
        setDecks(decks.map(d => d.id === id ? renamed_deck : d));
    }

    const handleDeckDeletion = async (id) => {
        await deleteDeck(id);
        setDecks(decks.filter(d => d.id !== id));
    }

    const handleSaveDeck = async (id, name) => {
        if (modalConfig.mode === "create") {
            await handleDeckCreation(name);
        } else if (modalConfig.mode === "rename") {
            await handleDeckRename(id, name);
        }
    }

    return (
        <>
            <div className="bg-gray-950 text-white flex flex-col w-full">
                <button className='bg-green-900 px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors absolute bottom-6 right-1/2 translate-x-1/2' onClick={() => openCreateModal()}> + New deck </button>
                {!decks || decks.length === 0 ? (
                    <div className="text-7xl font-bold flex items-center justify-center">
                        <h1>No decks found</h1>
                    </div>
                    ) : (
                        decks.map((deck) => (
                            <div key={deck.id} className="bg-gray-700 text-2xl font-bold flex items-center justify-start m-5 gap-4 p-4">
                                <h1>{deck.name}</h1>
                                <button className='bg-red-600' onClick={() => handleDeckDeletion(deck.id)}>Delete</button>
                                <button className='bg-blue-600' onClick={() => openRenameModal(deck.id, deck.name)}>Rename</button>
                                <button className='bg-indigo-400' onClick={() => onDeckSelect(deck)}>Select</button>
                            </div>
                        )
                    ))
                }

                {modalConfig.isOpen && (
                    <DeckModal
                        mode={modalConfig.mode}
                        id={modalConfig.deck_id}
                        initial_value={modalConfig.initial_value}
                        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                        onSave={handleSaveDeck} />
                )}
            </div>
        </>
    );
}