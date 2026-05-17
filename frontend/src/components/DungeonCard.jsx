import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function DungeonCard({ dungeon, onDelete, onEdit }) {
    const [ decks, setDecks ] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/dungeons/${dungeon.id}/decks`)
        .then(res => res.json())
        .then(setDecks);
    }, [dungeon]);

    return (
        <>
            <div className="bg-gray-700 text-2xl font-bold flex flex-col justify-start m-5"> 
                <div className="flex flex-row gap-3 p-5">
                    <h1>{dungeon.name}</h1>
                    <button className='bg-red-600' onClick={() => onDelete(dungeon.id)}>Delete</button>
                    <button className="bg-orange-500" onClick={() => onEdit(dungeon.id, dungeon.name)}>Edit</button>
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