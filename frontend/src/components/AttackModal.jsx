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

    console.log(card.question);
    
    return (
        <>
            <Modal children={
                <div>
                    <h1 className="text-xl font-bold text-white mb-2">Attack!</h1>
                    <h2 className="text-white font-bold mb-4">Question: {card.question}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2"> Answer to attack the monster! </label>
                        <input
                            type="text"
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full bg-zinc-950 border rounded-lg px-4 py-2 text-white focus:outerline-none focus:border-purple-600 transition-colors"
                            required
                        />
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                type="button"
                                className="px-4 py-2 rounded-lg bg-zing-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors"
                                onClick={() => { setAnswer(''); onClose(); }}>
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-900/20">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            } />
        </>
    );
}