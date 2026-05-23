import Modal from "./Modal";

export default function EarlyFleeModal({ onClose, onContinue, fee }) {
    return (
        <>
            <Modal children={
                <div className="flex flex-col space-y-8">
                    <h1 className="text-xl text-center font-semibold text-white mb-2">Are you sure you want to flee?</h1>
                    <span className="text-center text-dungeon-red-500 font-bold text-xl mb-6">You will lose {100 - fee * 100}% of xp!</span>
                    <div className="flex flex-row justify-between text-white">
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-dungeon-red-900 hover:text-dungeon-red-900 hover:bg-dungeon-yellow" onClick={onClose}>Flee!</button>
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-dungeon-green-700 hover:text-dungeon-green-900 hover:bg-dungeon-yellow" onClick={onContinue}>Continue</button>
                    </div>
                </div>
            } />
        </>
    )
}