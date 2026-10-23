import { useState, useEffect } from 'react';

import { useUserData } from '../store/store';

import { getDues } from '../services/api';

import DeckModal from './DeckModal';
import DeckCard from './DeckCard';

import IntermittentMessage from './IntermittentMessage';

export default function Decks({ onDeckSelect }) {
    const decks = useUserData(state => state.decks);
    const getCachedDecks = useUserData(state => state.getCachedDecks);
    const addCachedDeck = useUserData(state => state.addCachedDeck);
    const renameCachedDeck = useUserData(state => state.renameCachedDeck);
    const deleteCachedDeck = useUserData(state => state.deleteCachedDeck);

    const [ deckDues, setDeckDues ] = useState(null);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", deck_id: null, initial_value: "" });
    const [ deckError, setDeckError ] = useState(null);

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", deck_id: null, initial_value: "" });
    }

    const openRenameModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "rename", deck_id: id, initial_value: name });
    }

    useEffect(() => {
        try {
            getCachedDecks();
        } catch (err) {
            setDeckError(err.message);
        }

        getDues().then(res => {
            if (!res.ok) {
                setDeckError('Failed to fetch deck dues');
                return;
            }

            setDeckDues(res.data);
        });
    }, []);

    const handleDeckCreation = async (name) => {
        try {
            await addCachedDeck(name);
        } catch (err) {
            setDeckError(err.message);
        }
    }

    const handleDeckRename = async (id, name) => {
        try {
            await renameCachedDeck(id, name);
        } catch (err) {
            setDeckError(err.message);
        }
    }

    const handleDeckDeletion = async (id) => {
        try {
            await deleteCachedDeck(id);
        } catch (err) {
            setDeckError(err.message);
        }
    }

    const handleSaveDeck = async (id, name) => {
        if (modalConfig.mode === "create") {
            await handleDeckCreation(name);
        } else if (modalConfig.mode === "rename") {
            await handleDeckRename(id, name);
        }
    }

    let interMsg = null;

    if (deckError) {
        interMsg = { title: "Error", subtitle: deckError };
    } else if (!decks) {
        interMsg = { title: "Loading", subtitle: "Please wait..." };
    } else if (decks.length === 0) {
        interMsg = { title: "No decks found", subtitle: "Click the button above to create a new deck", child: (
            <>
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New deck -</button>
                {modalConfig.isOpen && (
                    <DeckModal
                        mode={"create"}
                        id={null}
                        initial_value={""}
                        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                        onSave={handleSaveDeck} />
                )}
            </>
        ) };
    }

    if (interMsg) {
        return <IntermittentMessage title={interMsg.title} subtitle={interMsg.subtitle} child={interMsg.child} />
    }

    return (
        <>
            <div className="text-white flex flex-col flex-1 w-full">
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New deck -</button>
                <div className='overflow-y-auto custom-scroll'>
                    {decks.map((deck) => (
                        <DeckCard key={deck.id} deck={deck} onSelect={onDeckSelect} onRename={openRenameModal} onDelete={handleDeckDeletion} dues={deckDues} />
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