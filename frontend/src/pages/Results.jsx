export default function Results({ onNavigate, results }) {
    return (
        <>
            <div className="w-full min-h-screen max-h-screen flex flex-col items-center justify-center bg-dungeon-dark-900 p-4 *:m-4">
                <h1 className="text-5xl font-pixel-header font-bold text-center text-dungeon-orange-glow animate-fade-in">Congratulations!</h1>

                <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 items-center animate-fade-in">
                    <div className="flex flex-col text-white bg-dungeon-dark-500 border border-dungeon-yellow rounded-lg p-4">
                        <h1 className="text-2xl font-pixel-header text-dungeon-yellow">Stats</h1>
                        <div className="*:text-2xl *:font-semibold space-y-1">
                            <p className="text-dungeon-red-500">Correct: {results.answer_stats.correct}</p>
                            <p className="text-dungeon-green-200">Incorrect: {results.answer_stats.incorrect}</p>
                            <p>Total: {results.answer_stats.correct + results.answer_stats.incorrect}</p>
                        </div>
                    </div>
                    <div className="flex flex-col text-white bg-dungeon-dark-500 border border-dungeon-yellow rounded-lg p-4">
                        <h1 className="text-2xl font-pixel-header text-dungeon-yellow">XP earned</h1>
                        <div className="flex flex-col text-2xl space-y-1 max-h-1/4 overflow-y-auto">
                            {results.decks.map((deck) => (
                                <span key={deck.id}>
                                    {deck.name} <span className="font-semibold text-dungeon-yellow-glow">+{deck.xp_gained}XP</span>
                                    {deck.level_gained > 0 && (
                                        <span className="font-bold text-dungeon-orange-glow"> +{deck.level_gained} levels!</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    className="px-4 py-2 rounded-lg font-semibold text-2xl transition-colors bg-dungeon-green-700 hover:bg-dungeon-yellow text-white hover:text-dungeon-dark-900 animate-fade-in"
                    onClick={() => {onNavigate({name: 'home'})}}
                    >
                    Alright!
                </button>
            </div>
        </>
    )
}