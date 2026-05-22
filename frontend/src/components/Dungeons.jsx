import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import DungeonModal from './DungeonModal';
import DungeonCard from './DungeonCard';

import { getDungeons, createDungeon, editDungeon, deleteDungeon } from '../api';

export default function Dungeons({ onDungeonSelect }) {
    const { user } = useUser();
    const [ dungeons, setDungeons ] = useState([]);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", id: null, initial_name: "" });

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", id: null, initial_name: "" });
    }

    const openEditModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "edit", id: id, initial_name: name });
    }

    useEffect(() => {
        getDungeons(user.id)
        .then(setDungeons);
    }, [user?.id]);

    const handleDungeonCreation = async (name, deck_ids) => {
        const new_dungeon = await createDungeon(user.id, name, deck_ids);
        setDungeons([...dungeons, new_dungeon]);
    }

    const handelDungeonEdit = async (id, name, deck_ids) => {
        const edited_dungeon = await editDungeon(id, name, deck_ids);
        setDungeons(dungeons.map(d => d.id === id ? edited_dungeon : d));
    }

    const handleDungeonSave = async (id, name, deck_ids) => {
        if (modalConfig.mode === "create") {
            await handleDungeonCreation(name, deck_ids);
        } else if (modalConfig.mode === "edit") {
            await handelDungeonEdit(id, name, deck_ids);
        }
    }

    const handleDungeonDeletion = async (id) => {
        deleteDungeon(id);
        setDungeons(dungeons.filter(d => d.id !== id));
    }

    return (
        <>
            <div className='text-white flex flex-col flex-1 w-full'>
                <button className='bg-green-800 px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors m-4' onClick={() => openCreateModal()}> + New dungeon </button>
                    <div className="grid md:grid-cols-2 overflow-y-auto">
                        {modalConfig.isOpen && (
                            <DungeonModal 
                                mode={modalConfig.mode}
                                id={modalConfig.id}
                                initial_name={modalConfig.initial_name}
                                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                onSave={handleDungeonSave} />
                        )}
                        {!dungeons || dungeons.length === 0 ? (
                            <div className="text-7xl font-bold flex items-center justify-center">
                                <h1>No dungeons found</h1>
                            </div>
                            ) : (
                                dungeons.map((dungeon) => (
                                    <div key={dungeon.id}>
                                        <DungeonCard dungeon={dungeon} onDelete={handleDungeonDeletion} onEdit={openEditModal} onPlay={onDungeonSelect} />
                                    </div>
                                )
                            ))
                        }
                    </div>
            </div>
        </>
    );
}