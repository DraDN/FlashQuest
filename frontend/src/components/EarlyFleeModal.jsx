import Modal from "./Modal";

export default function EarlyFleeModal({ onClose, onContinue, fee }) {
    return (
        <>
            <Modal children={
                <div className="flex flex-col space-y-8">
                    <h1 className="text-xl text-center font-semibold text-white mb-4">Are you sure you want to flee?</h1>
                    <span className="text-center text-dungeon-red-500 font-bold text-xl mb-4">You will lose {100 - fee * 100}% of xp!</span>
                    <div className="flex flex-row justify-between text-white">
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-red-600 hover:bg-red-800" onClick={onClose}>Flee!</button>
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-green-600 hover:bg-green-800" onClick={onContinue}>Continue</button>
                    </div>
                </div>
            } />
        </>
    )
}