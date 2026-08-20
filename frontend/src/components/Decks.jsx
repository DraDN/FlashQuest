import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import { getDecks, createDeck, renameDeck, deleteDeck } from '../services/api';

import DeckModal from './DeckModal';
import DeckCard from './DeckCard';

import IntermittentMessage from './IntermittentMessage';

export default function Decks({ onDeckSelect }) {
    const { user } = useUser();
    const [ decks, setDecks ] = useState(undefined);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", deck_id: null, initial_value: "" });
    const [ isDeckError, setIsDeckError ] = useState(false);

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", deck_id: null, initial_value: "" });
    }

    const openRenameModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "rename", deck_id: id, initial_value: name });
    }

    useEffect(() => {
        getDecks().then(res => {
            if (!res.ok) {
                setIsDeckError(true);
                return;
            }

            setDecks(res.data);
        });
    }, [user.id]);

    const handleDeckCreation = async (name) => {
        const res = await createDeck(name);
        if (!res.ok) {
            return;
        }

        const new_deck = res.data;
        setDecks([...decks, new_deck]);
    }

    const handleDeckRename = async (id, name) => {
        const res = await renameDeck(id, name);
        if (!res.ok) {
            return;
        }

        const renamed_deck = res.data;
        setDecks(decks.map(d => d.id === id ? renamed_deck : d));
    }

    const handleDeckDeletion = async (id) => {
        const res = await deleteDeck(id);
        if (!res.ok) {
            return;
        }

        setDecks(decks.filter(d => d.id !== id));
    }

    const handleSaveDeck = async (id, name) => {
        if (modalConfig.mode === "create") {
            await handleDeckCreation(name);
        } else if (modalConfig.mode === "rename") {
            await handleDeckRename(id, name);
        }
    }

    let interMsg = null;

    if (isDeckError) {
        interMsg = { title: "Error", subtitle: "Could not load decks" };
    } else if (!decks) {
        interMsg = { title: "Loading", subtitle: "Please wait..." };
    } else if (decks.length === 0) {
        interMsg = { title: "No decks found", subtitle: "Click the button above to create a new deck" };
    }

    if (interMsg) {
        return <IntermittentMessage title={interMsg.title} subtitle={interMsg.subtitle} />
    }

    return (
        <>
            <div className="text-white flex flex-col flex-1 w-full">
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New deck -</button>
                <div className='overflow-y-auto custom-scroll'>
                    {decks.map((deck) => (
                        <DeckCard key={deck.id} deck={deck} onSelect={onDeckSelect} onRename={openRenameModal} onDelete={handleDeckDeletion} />
                    ))}
                </div>
                     

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