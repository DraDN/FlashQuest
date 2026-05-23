export default function Sidemenu({ subpage, setSubpage }) {
    return (
        <>
            <div className="text-white font-pixel-header p-12 flex flex-col space-y-12 text-center">
                <div>
                    <h1 className="text-4xl font-light text-shadow-sm text-shadow-white">- My stuff -</h1>
                </div>
                <div className="flex flex-col space-y-2 text-3xl *:text-shadow-sm *:p-4 *:font-bold *:hover:text-dungeon-yellow *:transition-colors">
                    <button className={`${subpage === 'decks' ? "text-dungeon-red-500 text-shadow-dungeon-red-900" : "text-dungeon-purple text-shadow-dungeon-dark-500"}`} onClick={() => setSubpage('decks')}>- Decks -</button>
                    <button className={`${subpage === 'dungeons' ? "text-dungeon-red-500 text-shadow-dungeon-red-900" : "text-dungeon-purple text-shadow-dungeon-dark-500"}`} onClick={() => setSubpage('dungeons')}>- Dungeons -</button>
                </div>
            </div>
        </>
    )
}