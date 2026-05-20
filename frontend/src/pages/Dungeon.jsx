import { useState, useEffect } from "react";
import { getDungeonCards } from "../api";

function Dungeon({ dungeon, onNavigate }) {
    const [ cards, setCards ] = useState([]);

    useEffect(() => {
        getDungeonCards(dungeon.id)
        .then(setCards);
    }, [dungeon]);

    return (
        <>
            <div>
                <h1>Dungeon {dungeon.name}</h1>
                <button onClick={() => onNavigate('home')}>go back</button>

                <div>
                    {cards.map(c => (
                        <div key={c.id}>
                            <p>{c.question}</p>
                            <p>{c.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Dungeon;