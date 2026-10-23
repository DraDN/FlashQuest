import { useState, useEffect } from 'react';
import { useUserData } from '../store/store'; 

import DungeonModal from './DungeonModal';
import DungeonCard from './DungeonCard';

import IntermittentMessage from './IntermittentMessage';

export default function Dungeons({ onDungeonSelect }) {
    const dungeons = useUserData(state => state.dungeons);
    const getCachedDungeons = useUserData(state => state.getCachedDungeons);
    const addCachedDungeon = useUserData(state => state.addCachedDungeon);
    const editCachedDungeon = useUserData(state => state.editCachedDungeon);
    const deleteCachedDungeon = useUserData(state => state.deleteCachedDungeon);

    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", id: null, initial_name: "" });
    const [ dungeonError, setDungeonError ] = useState(null);

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", id: null, initial_name: "" });
    }

    const openEditModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "edit", id: id, initial_name: name });
    }

    useEffect(() => {
        try {
            getCachedDungeons()
        } catch (err) {
            setDungeonError(err.message);
        }
    }, []);

    const handleDungeonCreation = async (name, deck_ids) => {
        try {
            await addCachedDungeon(name, deck_ids);
        } catch (err) {
            setDungeonError(err.message);
        }
    }

    const handelDungeonEdit = async (id, name, deck_ids) => {
        try {
            await editCachedDungeon(id, name, deck_ids);
        } catch (err) {
            setDungeonError(err.message);
        }
    }

    const handleDungeonSave = async (id, name, deck_ids) => {
        if (modalConfig.mode === "create") {
            await handleDungeonCreation(name, deck_ids);
        } else if (modalConfig.mode === "edit") {
            await handelDungeonEdit(id, name, deck_ids);
        }
    }

    const handleDungeonDeletion = async (id) => {
        try {
            await deleteCachedDungeon(id);
        } catch (err) {
            setDungeonError(err.message);
        }
    }

    let interMsg = null;

    if (dungeonError) {
        interMsg = { title: "Error", subtitle: dungeonError };
    } else if (!dungeons) {
        interMsg = { title: "Loading", subtitle: "Please wait..." };
    } else if (dungeons.length === 0) {
        interMsg = { title: "No dungeons found", subtitle: "Create one to get started", child : (
            <>
                <button className='text-dungeon-green-200 text-shadow-md text-shadow-dungeon-green-900 px-4 py-3 rounded-xl hover:bg-dungeon-yellow hover:text-dungeon-dark-900 transition-colors m-4 font-bold text-4xl font-pixel-header' onClick={() => openCreateModal()}>- New Dungeon -</button>
                {modalConfig.isOpen && (
                    <DungeonModal 
                        mode={modalConfig.mode}
                        id={modalConfig.id}
                        initial_name={modalConfig.initial_name}
                        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                        onSave={handleDungeonSave} />
                )}
            </>
        )};
    }

    if (interMsg) {
        return <IntermittentMessage title={interMsg.title} subtitle={interMsg.subtitle} child={interMsg.child} />
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