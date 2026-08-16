import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import { getDecks, createDeck, renameDeck, deleteDeck } from '../utils/api';

import DeckModal from './DeckModal';
import DeckCard from './DeckCard';

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
        getDecks().then(setDecks);
    }, [user.id]);

    const handleDeckCreation = async (name) => {
        const new_deck = await createDeck(name);
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
            <div className="text-white flex flex-col flex-1 w-full">
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New deck -</button>
                    {!decks || decks.length === 0 ? (
                        <div className="flex grow flex-col gap-6 items-center justify-center">
                            <h1 className='text-7xl font-bold'>No decks found</h1>
                            <h2 className='text-lg font-medium'>Click the button above to create a new deck</h2>
                        </div>
                        ) : (
                        <div className='overflow-y-auto custom-scroll'>
                            {decks.map((deck) => (
                                <DeckCard key={deck.id} deck={deck} onSelect={onDeckSelect} onRename={openRenameModal} onDelete={handleDeckDeletion} />
                            ))}
                        </div>
                        )
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