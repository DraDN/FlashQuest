import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import DungeonModal from './DungeonModal';
import DungeonCard from './DungeonCard';

import { getDungeons, createDungeon, editDungeon, deleteDungeon } from '../services/api';

import IntermittentMessage from './IntermittentMessage';

export default function Dungeons({ onDungeonSelect }) {
    const { user } = useUser();
    const [ dungeons, setDungeons ] = useState(undefined);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", id: null, initial_name: "" });
    const [ isDungeonError, setIsDungeonError ] = useState(false);

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", id: null, initial_name: "" });
    }

    const openEditModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "edit", id: id, initial_name: name });
    }

    useEffect(() => {
        getDungeons()
        .then(res => {
            if (!res.ok) {
                setIsDungeonError(true);
                return;
            }

            setDungeons(res.data);
        });
    }, [user.id]);

    const handleDungeonCreation = async (name, deck_ids) => {
        const res = await createDungeon(name, deck_ids);
        if (!res.ok) {
            return;
        }

        const new_dungeon = res.data;
        setDungeons([...dungeons, new_dungeon]);
    }

    const handelDungeonEdit = async (id, name, deck_ids) => {
        const res = await editDungeon(id, name, deck_ids);
        if (!res.ok) {
            // TODO: show error to user
            return;
        }

        const edited_dungeon = res.data;
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
        const res = await deleteDungeon(id);
        if (!res.ok) {
            return;
        }

        setDungeons(dungeons.filter(d => d.id !== id));
    }

    if (isDungeonError) {
        return (
            <IntermittentMessage title="Error" subtitle="Could not load dungeons" />
        );
    } else if (!dungeons) {
        return (
            <IntermittentMessage title="Loading" subtitle="Please wait" />
        );
    } else if (dungeons.length === 0) {
        return (
            <IntermittentMessage title="No dungeons found" subtitle="Create one to get started" />
        );
    }

    return (
        <>
            <div className='text-white flex flex-col flex-1 w-full'>
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New Dungeon -</button>
                        {modalConfig.isOpen && (
                            <DungeonModal 
                                mode={modalConfig.mode}
                                id={modalConfig.id}
                                initial_name={modalConfig.initial_name}
                                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                onSave={handleDungeonSave} />
                        )}

                        <div className="grid md:grid-cols-2 overflow-y-auto custom-scroll">
                                {dungeons.map((dungeon) => (
                                    <div key={dungeon.id}>
                                        <DungeonCard dungeon={dungeon} onDelete={handleDungeonDeletion} onEdit={openEditModal} onPlay={onDungeonSelect} />
                                    </div>
                                ))}
                        </div>
            </div>
        </>
    );
}