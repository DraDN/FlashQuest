import { useState, useEffect, useRef } from "react";

import { getCards, createCard, editCard, deleteCard } from "../services/api";
import CardModal from "../components/CardModal";

import IntermittentMessage from "../components/IntermittentMessage";

export default function DeckEditor({ deck, onNavigate }) {
    const [ cards, setCards ] = useState(undefined);
    const [ modalConfig, setModalConfig ] = useState({ isOpen: false, mode: "create", card_id: null, initial_value: { question: "", answer: "" } });
    const [ isCardError, setIsCardError ] = useState(false);

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", card_id: null, initial_value: { question: "", answer: "" } });
    }

    const openEditModal = (id, question, answer) => {
        setModalConfig({ isOpen: true, mode: "edit", card_id: id, initial_value: { question, answer } });
    }

    const handleCardCreation = async (question, answer) => {
        const res = await createCard(deck.id, question, answer);
        if (!res.ok) {
            return;
        }

        const new_card = res.data;
        setCards([...cards, new_card]);
    }

    const handleCardEdit = async (id, question, answer) => {
        const res = await editCard(id, question, answer);
        if (!res.ok) {
            return;
        }

        const edited_card = res.data;
        setCards(cards.map(c => c.id === id ? edited_card : c));
    }

    const handleCardDeletion = async (id) => {
        const res = await deleteCard(id);
        if (!res.ok) {
            return;
        }

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
        getCards(deck.id).then(res => {
            if (!res.ok) {
                setIsCardError(true);
                return
            }

            setCards(res.data);
        });
    }, [deck.id]);

    let interMsg = null;

    if (isCardError) {
        interMsg = { title: "Error", subtitle: "Could not load cards" };
    } else if (!cards) {
        interMsg = { title: "Loading", subtitle: "Please wait..." };
    }

    if (interMsg) {
        return (
            <div className="w-full min-h-screen">
                <IntermittentMessage title={interMsg.title} subtitle={interMsg.subtitle} back={() => onNavigate({name: 'home'})} />
            </div>
        )
    }

    return (
        <>
            <div className="w-full min-h-screen flex flex-col text-white">
                <div className="inline-flex w-full bg-dungeon-dark-900 items-center justify-between">
                    <h1 className="text-3xl font-pixel-header font-bold p-5">Cards of <span className="text-dungeon-orange-glow">{deck.name}</span>: </h1>

                    <button className="px-4 py-2 m-4 border border-dungeon-red-900 rounded-xl text-dungeon-red-900 font-bold hover:bg-dungeon-red-900 hover:text-dungeon-dark-900 transition-colors" onClick={() => onNavigate({name: 'home'})}>- Back -</button>
                </div>
                <div className="flex flex-col grow relative bg-dungeon-dark-900">
                    <div className="grid grid-cols-3 place-items-center font-pixel-header text-4xl *:p-5">
                        <p>Question</p>
                        <p>Answer</p>
                        <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-3xl font-pixel-header' onClick={() => openCreateModal()}>- New card -</button>
                    </div>
                    {cards.map((card) => (
                        <div key={card.id} className="grid grid-cols-3 text-xl items-center m-4 *:p-2 *:m-2 mb-2 border border-dungeon-yellow divide-x-2 divide-dungeon-yellow">
                                <p>{card.question}</p>
                                <p>{card.answer}</p>
                                <div className='*:p-2 *:rounded-xl *:hover:bg-dungeon-yellow *:transition-colors flex justify-center md:flex-row flex-col gap-2'>
                                    <button className="bg-dungeon-red-900 grow" onClick={() => handleCardDeletion(card.id)}>Delete</button>
                                    <button className="bg-dungeon-purple grow" onClick={() => openEditModal(card.id, card.question, card.answer)}>Edit</button>
                                </div>
                        </div>
                    ))}
                    {cards.length === 0 && (
                        <IntermittentMessage title="Deck is empty" subtitle="Please add some cards" />
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