import Modal from "./Modal";

export default function DeathModal({ onExit }) {
    return (
        <>
            <Modal children={
                <div className="flex flex-col space-y-8">
                    <h1 className="text-7xl text-center font-bold font-pixel-header text-red-500 text-shadow-dungeon-red-900 text-shadow-md mb-4">You died!</h1>
                    <span className="text-center text-white font-bold text-lg mb-4">Maybe you should check your notes...</span>
                    <div className="flex justify-center">
                        <button className="px-4 py-2 rounded-lg font-semibold text-md transition-colors text-dungeon-dark-500 bg-dungeon-red-900 hover:text-dungeon-red-900 hover:bg-dungeon-dark-500" onClick={onExit}>Exit</button>
                    </div>
                </div>
            } />
        </>
    )
}