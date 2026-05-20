import { useState, useEffect } from "react";

import { getDungeonDecks } from "../api";

export default function DungeonCard({ dungeon, onDelete, onEdit, onPlay }) {
    const [ decks, setDecks ] = useState([]);

    useEffect(() => {
        getDungeonDecks(dungeon.id)
        .then(setDecks);
    }, [dungeon]);

    return (
        <>
            <div className="bg-gray-700 text-2xl font-bold flex flex-col justify-start m-5"> 
                <div className="flex flex-row flex-wrap gap-3 p-5">
                    <h1>{dungeon.name}</h1>
                    <button className='bg-red-600' onClick={() => onDelete(dungeon.id)}>Delete</button>
                    <button className="bg-orange-500" onClick={() => onEdit(dungeon.id, dungeon.name)}>Edit</button>
                    <button className="bg-green-600" onClick={() => onPlay(dungeon)}>Play</button>
                </div>
                <div className="px-5 pb-5 text-lg">
                    <h1 className="text-xl text-zinc-950 font-medium mb-2">Containing decks:</h1>
                    <ul>
                        {decks.map(d => <li key={d.id}>{d.name}</li>)}
                    </ul>
                </div>
            </div>
        </>
    )
}