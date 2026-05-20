export default function Sidemenu({ subpage, setSubpage }) {
    return (
        <>
            <div className="text-white p-12 flex flex-col space-y-12 text-center">
                <div>
                    <h1 className="text-3xl font-extralight">- My stuff -</h1>
                </div>
                <div className="flex flex-col space-y-2 text-xl">
                    <button className={`${subpage === 'decks' ? "text-dungeon-red-500" : "text-dungeon-purple"} p-4 font-extrabold hover:text-dungeon-yellow transition-colors`} onClick={() => setSubpage('decks')}>- Decks -</button>
                    <button className={`${subpage === 'dungeons' ? "text-dungeon-red-500" : "text-dungeon-purple"} p-4 font-extrabold hover:text-dungeon-yellow transition-colors`} onClick={() => setSubpage('dungeons')}>- Dungeons -</button>
                </div>
            </div>
        </>
    )
}