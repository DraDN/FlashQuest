import { useState, useEffect } from "react";

import { useUserData } from "../store/store";

export default function DungeonCard({ dungeon, onDelete, onEdit, onPlay }) {
    const dungeonDecks = useUserData(state => state.dungeonDecks);
    const getCachedDungeonDecks = useUserData(state => state.getCachedDungeonDecks);
    const [ deckError, setDeckError ] = useState(null);

    useEffect(() => {
        try {
            getCachedDungeonDecks(dungeon.id);
        } catch (err) {
            setDeckError(err.message);
        }
    }, [dungeon.id]);

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
                        {(!dungeonDecks[dungeon.id] && !deckError) ? <li>Loading...</li> : (
                            deckError ? <li>{deckError}</li> : dungeonDecks[dungeon.id].map(d => <li key={d.id}> - {d.name}</li>)
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}