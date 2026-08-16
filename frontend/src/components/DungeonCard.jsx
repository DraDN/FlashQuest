import { useState, useEffect } from "react";

import { getDungeonDecks } from "../services/api";

export default function DungeonCard({ dungeon, onDelete, onEdit, onPlay }) {
    const [ decks, setDecks ] = useState([]);

    useEffect(() => {
        getDungeonDecks(dungeon.id)
        .then(setDecks);
    }, [dungeon]);

    return (
        <>
            <div className="bg-dungeon-dark-500 border-dungeon-yellow border text-2xl font-bold flex flex-col justify-start m-5"> 
                <div className="flex md:flex-row flex-col flex-wrap gap-3 items-center justify-between p-5">
                    <span className="font-bold text-3xl">{dungeon.name}</span>
                    <div className="flex flex-row flex-wrap gap-2 items-center *:p-2 *:rounded-xl *:hover:bg-dungeon-yellow *:transition-colors">
                        <button className='bg-dungeon-red-900' onClick={() => onDelete(dungeon.id)}>Delete</button>
                        <button className="bg-dungeon-purple" onClick={() => onEdit(dungeon.id, dungeon.name)}>Edit</button>
                        <button className="bg-dungeon-green-700" onClick={() => onPlay(dungeon)}>Play</button>
                    </div>
                </div>
                <div className="px-5 pb-5 text-lg">
                    <span className="text-xl text-dungeon-green-200 font-medium mb-2">Containing decks:</span>
                    <ul>
                        {decks.map(d => <li key={d.id}> - {d.name}</li>)}
                    </ul>
                </div>
            </div>
        </>
    )
}