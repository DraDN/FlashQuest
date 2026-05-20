import { useState, useEffect } from "react";

import { getCards, createCard, editCard, deleteCard } from "../api";
import CardModal from "../components/CardModal";

export default function DeckEditor({ deck, onNavigate }) {
    const [ cards, setCards ] = useState([]);
    const [ modalConfig, setModalConfig ] = useState({ isOpen: false, mode: "create", card_id: null, initial_value: { question: "", answer: "" } });

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", card_id: null, initial_value: { question: "", answer: "" } });
    }

    const openEditModal = (id, question, answer) => {
        setModalConfig({ isOpen: true, mode: "edit", card_id: id, initial_value: { question, answer } });
    }

    const handleCardCreation = async (question, answer) => {
        const new_card = await createCard(deck.id, question, answer);
        setCards([...cards, new_card]);
    }

    const handleCardEdit = async (id, question, answer) => {
        const edited_card = await editCard(id, question, answer);
        setCards(cards.map(c => c.id === id ? edited_card : c));
    }

    const handleCardDeletion = async (id) => {
        await deleteCard(id);
        setCards(cards.filter(c => c.id !== id));
    }

    const handleSaveCard = async (id, question, answer) => {
        if (modalConfig.mode === "create") {
            await handleCardCreation(question, answer);
        } else if (modalConfig.mode === "edit") {
            await handleCardEdit(id, question, answer);
        }
    }

    useEffect(() => {
        getCards(deck.id).then(setCards);
    }, [deck]);

    return (
        <>
            <div className="w-full min-h-screen flex flex-col bg-gray-950 text-dungeon-gold">
                <div className="flex flex-row justify-between p-5 bg-gray-500">
                    <h1 className="font-bold">Deck Editor - {deck.name}</h1>
                    <button onClick={() => onNavigate('home')}>go back</button>
                </div>
                <div className="inline-flex w-full bg-gray-600 items-center justify-between">
                    <h1 className="text-3xl font-bold p-5">Cards:</h1>
                    <button className='bg-green-900 px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors text-2xl m-4' onClick={openCreateModal}> + New card </button>
                </div>
                <div className="grow relative flex flex-col pb-26">
                    {!cards || cards.length === 0 ? (
                        <div className="grow flex flex-col items-center justify-center gap-6">
                            <h1 className="text-7xl font-bold">Deck is empty</h1>
                            <h2 className="text-lg font-medium">Please add some cards</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col bg-gray-900">
                            <div className="grid grid-cols-3 place-items-center *:p-5">
                                <p>Question</p>
                                <p>Answer</p>
                            </div>
                            {cards.map((card) => (
                                <div key={card.id} className="grid grid-cols-3 *:border-10 *:border-gray-700 *:p-5">
                                    <p>{card.question}</p>
                                    <p>{card.answer}</p>
                                    <div className="flex flex-row gap-4">
                                        <button className="bg-red-600 grow" onClick={() => handleCardDeletion(card.id)}>Delete</button>
                                        <button className="bg-orange-500 grow" onClick={() => openEditModal(card.id, card.question, card.answer)}>Edit</button>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    )}
                </div>

                {modalConfig.isOpen && (
                    <CardModal
                        mode={modalConfig.mode}
                        id={modalConfig.card_id}
                        initial_value={modalConfig.initial_value}
                        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                        onSave={handleSaveCard} />
                )}
            </div>
        </>
    )
}