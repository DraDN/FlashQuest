import Modal from "./Modal";

export default function RoundEndModal({ onClose, onNext, round, gained }) {
    return (
        <>
            <Modal children={
                <div className="flex md:flex-row flex-col justify-center items-center md:gap-x-8 gap-y-8 m-4">
                    <div className="p-6 bg-dungeon-dark-900 rounded-xl border border-dungeon-yellow">
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-xl font-bold text-white mb-4">Round {round}</h1>
                                <h2 className="text-4xl text-dungeon-orange-glow font-pixel-header text-center font-bold mb-2"> You won the round! </h2>
                                <h2 className="text-2xl text-center font-semibold text-white"> You've found <span className="text-dungeon-yellow-glow"> +{gained.coins} Coins! </span> </h2>
                                <h2 className="text-xl text-white text-center mb-4"> Do you wish to continue? More coins await! </h2>
                            </div>
                            <div className="flex flex-row justify-between text-white">
                                <button className="px-4 py-2 rounded-lg font-semibold text-md transition-colors bg-dungeon-red-900 hover:text-dungeon-red-900 hover:bg-dungeon-yellow" onClick={onClose}>Exit the dungeon</button>
                                <button className="px-4 py-2 rounded-lg font-semibold text-md transition-colors bg-dungeon-green-700 hover:text-dungeon-green-900 hover:bg-dungeon-yellow" onClick={onNext}>Next round!</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-dungeon-dark-900 rounded-xl border border-dungeon-yellow">
                        <h1 className="text-4xl font-pixel-header text-dungeon-orange-glow mb-4">Earned</h1>
                        <h2 className="text-2xl font-semibold text-dungeon-yellow-glow">+{gained.xp} XP</h2>                       
                        {gained.level > 0 && (
                            <span className="text-2xl font-semibold text-dungeon-orange-glow">+{gained.level} Levels</span>
                        )}
                    </div>
                </div>
            } basic={true} />
        </>
    )
}