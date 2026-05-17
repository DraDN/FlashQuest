import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import DeckModal from './DeckModal';

const API = import.meta.env.VITE_API_URL;

function Decks() {
    const { user } = useUser();
    const [ decks, setDecks ] = useState([]);
    // const [ isCreateModalOpen, setCreateModalVisibility ] = useState(false);
    // const [ isRenameModalOpen, setRenameModalVisibility ] = useState(false);
    // const [ renameDeckID, setRenameDeckID ] = useState(null);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", deck_id: null, initial_value: "" });

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", deck_id: null, initial_value: "" });
    }

    const openRenameModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "rename", deck_id: id, initial_value: name });
    }

    useEffect(() => {
        fetch(`${API}/api/decks?user_id=${user.id}`)
        .then(res => res.json())
        .then(setDecks);
    }, [user?.id]);

    const createDeck = async (name) => {
        const res = await fetch(`${API}/api/decks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id, name: name })
        })
        const deck = await res.json();
        setDecks([...decks, deck]);
    }

    const renameDeck = async (id, newName) => {
        const res = await fetch(`${API}/api/decks/${id}/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        })
        const deck = await res.json();
        setDecks(decks.map(d => d.id === id ? deck : d));
    }

    const handleSaveDeck = async (id, name) => {
        if (modalConfig.mode === "create") {
            await createDeck(name);
        } else if (modalConfig.mode === "rename") {
            await renameDeck(id, name);
        }
    }

    const deleteDeck = async (id) => {
        await fetch(`${API}/api/decks/${id}`, {
            method: 'DELETE'
        })
        setDecks(decks.filter(d => d.id !== id));
    }

    return (
        <>
            <div className="bg-gray-950 text-white grid md:grid-cols-2 w-full">
                {/* <button className="bg-blue-500 p-5 rounded-xl hover:bg-red-500 transition-colors" onClick={() => onNavigate('home')}>go back</button> */}
                <button className='bg-green-900 px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors absolute bottom-6 right-1/2 translate-x-1/2' onClick={() => openCreateModal()}> + New deck </button>
                {!decks || decks.length === 0 ? (
                    <div className="text-7xl font-bold flex items-center justify-center">
                        <h1>No decks found</h1>
                    </div>
                    ) : (
                        decks.map((deck) => (
                            <div key={deck.id} className="bg-gray-700 text-2xl font-bold flex items-center justify-start m-5 gap-4 p-4">
                                <h1>{deck.name}</h1>
                                <button className='bg-red-600' onClick={() => deleteDeck(deck.id)}>Delete</button>
                                <button className='bg-blue-600' onClick={() => openRenameModal(deck.id, deck.name)}>Rename</button>
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

export default Decks;