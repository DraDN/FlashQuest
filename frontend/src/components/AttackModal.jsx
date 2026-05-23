import { useState } from "react";
import Modal from "./Modal";

export default function AttackModal({ onClose, onSave, card }) {
    const [ answer, setAnswer ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(answer);
        setAnswer('');
        onClose();
    }
    
    return (
        <>
            <Modal children={
                <div>
                    <h1 className="text-center text-2xl font-bold text-dungeon-orange-glow mb-2">Attack!</h1>
                    <div className="flex flex-col text-xl text-center text-white gap-1 mb-4">
                        <h2 className="">Question: </h2>
                        <span className="font-bold">{card.question}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-md font-medium text-zinc-400 mb-2"> Answer to attack the monster! </label>
                        <input
                            type="text"
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        
                        <div className="flex justify-end gap-3 pt-2 *:px-4 *:py-2 *:rounded-lg *:font-semibold *:text-sm *:transition-colors">
                            <button 
                                type="button"
                                className="bg-zing-800 hover:bg-zinc-700 text-zinc-300"
                                onClick={() => { setAnswer(''); onClose(); }}>
                                
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="bg-dungeon-green-700 hover:bg-dungeon-yellow text-white hover:text-dungeon-dark-900">
                                Answer
                            </button>
                        </div>
                    </form>
                </div>
            } />
        </>
    );
}