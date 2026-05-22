import Modal from "./Modal";

export default function RoundEndModal({ onClose, onNext, round }) {
    return (
        <>
            <Modal children={
                <div className="space-y-8">
                    <div>
                        <h1 className="text-xl font-bold text-white mb-4">Round {round}</h1>
                        <h2 className="text-white text-center font-bold mb-2"> You won the round! </h2>
                        <h2 className="text-white text-center font-bold mb-4"> Do you wish to continue? More xp awaits! </h2>
                    </div>
                    <div className="flex flex-row justify-between text-white">
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-red-600 hover:bg-red-800" onClick={onClose}>Exit the dungeon</button>
                        <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors bg-green-600 hover:bg-green-800" onClick={onNext}>Next round!</button>
                    </div>
                </div>
            } onClose={onClose} />
        </>
    )
}