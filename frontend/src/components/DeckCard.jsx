export default function DeckCard({ deck, onSelect, onRename, onDelete }) {
    return (
        <div className="bg-dungeon-dark-500 border border-dungeon-yellow text-2xl font-bold flex items-center justify-between m-5 gap-4 p-4">
            <div className="w-full space-y-2">
                <div className='flex flex-row gap-2 items-end grow'>
                    <h1>{deck.name}</h1>
                </div>
            </div>
            <div className='*:p-2 *:rounded-xl *:hover:bg-dungeon-yellow *:transition-colors flex md:flex-row flex-col gap-2'>
                <button className='bg-dungeon-red-900' onClick={() => {onDelete(deck.id)}}>Delete</button>
                <button className='bg-dungeon-purple' onClick={() => {onRename(deck.id, deck.name)}}>Rename</button>
                <button className='bg-dungeon-green-700' onClick={() => {onSelect(deck)}}>Select</button>
            </div>
        </div>
    )
}