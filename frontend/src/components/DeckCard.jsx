export default function DeckCard({ deck, onSelect, onRename, onDelete }) {
    return (
        <div className="bg-dungeon-dark-500 border border-dungeon-yellow text-2xl font-bold flex items-center justify-between m-5 gap-4 p-4">
            <div className="w-full space-y-2">
                <div className='flex flex-row gap-2 items-end grow'>
                    <h1>{deck.name}</h1>
                    <h2 className='shrink-0 font-semibold text-sm text-dungeon-yellow m-1'>LVL {deck.level}</h2>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='relative space-y-1.5 grow bg-dungeon-dark-900 border border-dungeon-yellow rounded-xl'>
                        <div className="w-full h-full flex grow">
                            <div className="flex flex-row p-4 bg-linear-to-r from-dungeon-purple to-dungeon-yellow rounded-xl transition-all duration-500 ease-out" style={{ width: `${(deck.xp / ((deck.level + 1) * 100)) * 100}%` }}></div>
                        </div>
                    </div>
                    <h2 className='font-medium text-sm text-dungeon-yellow'>XP {deck.xp}</h2>
                </div>
            </div>
            <div className='*:p-2 *:rounded-xl *:hover:bg-dungeon-yellow *:transition-colors flex md:flex-row flex-col gap-2'>
                <button className='bg-dungeon-red-900' onClick={() => {onDelete(deck.id)}}>Delete</button>
                <button className='bg-dungeon-purple' onClick={() => {onRename(deck.id, deck.name)}}>Rename</button>
                <button className='bg-dungeon-green' onClick={() => {onSelect(deck)}}>Select</button>
            </div>
        </div>
    )
}