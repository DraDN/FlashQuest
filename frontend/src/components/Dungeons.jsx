import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import CreateDungeonModal from './CreateDungeonModal';
import DungeonCard from './DungeonCard';

const API = import.meta.env.VITE_API_URL;

function Dungeons() {
    const { user } = useUser();
    const [ dungeons, setDungeons ] = useState([]);
    // const [ isCreateModalOpen, setCreateModalVisibility ] = useState(false);
    const [ modalConfig, setModalConfig ] = useState({ isOpen:false, mode: "create", id: null, initial_name: "" });

    const openCreateModal = () => {
        setModalConfig({ isOpen: true, mode: "create", id: null, initial_name: "" });
    }

    const openEditModal = (id, name) => {
        setModalConfig({ isOpen: true, mode: "edit", id: id, initial_name: name });
    }

    useEffect(() => {
        fetch(`${API}/api/dungeons?user_id=${user.id}`)
        .then(res => res.json())
        .then(setDungeons);
    }, [user?.id]);

    const createDungeon = async (name, deck_ids) => {
        const res = await fetch(`${API}/api/dungeons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id, name: name, deck_ids: deck_ids })
        })
        const dungeon = await res.json();
        setDungeons([...dungeons, dungeon]);
    }

    const editDungeon = async (id, name, deck_ids) => {
        const res = await fetch(`${API}/api/dungeons/${id}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, deck_ids: deck_ids })
        })
        const dungeon = await res.json();
        setDungeons(dungeons.map(d => d.id === id ? dungeon : d));
    }

    const handleDungeonSave = async (id, name, deck_ids) => {
        if (modalConfig.mode === "create") {
            await createDungeon(name, deck_ids);
        } else if (modalConfig.mode === "edit") {
            await editDungeon(id, name, deck_ids);
        }
    }

    const deleteDungeon = async (id) => {
        await fetch(`${API}/api/dungeons/${id}`, {
            method: 'DELETE'
        })
        setDungeons(dungeons.filter(d => d.id !== id));
    }

    return (
        <>
            <div className="bg-gray-950 text-white flex flex-col w-full">
                {/* <button className="bg-blue-500 p-5 rounded-xl hover:bg-red-500 transition-colors" onClick={() => onNavigate('home')}>go back</button> */}
                <button className='bg-green-900 px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors absolute bottom-6 right-1/2 translate-x-1/2' onClick={() => openCreateModal()}> + New dungeon </button>
                {modalConfig.isOpen && (
                    <CreateDungeonModal 
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
                                {/* <h1>{dungeon.name}</h1> */}
                                {/* <button className='bg-red-600' onClick={() => deleteDungeon(dungeon.id)}>Delete</button> */}
                                <DungeonCard dungeon={dungeon} onDelete={deleteDungeon} onEdit={openEditModal} />
                            </div>
                        )
                    ))
                }
            </div>
        </>
    );
}

export default Dungeons;