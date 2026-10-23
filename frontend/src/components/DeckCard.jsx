export default function DeckCard({ deck, onSelect, onRename, onDelete, dues }) {
    const dues_ui = () => {
        const this_due = dues?.find(d => d.deck_id === deck.id);

        if (this_due) {
            return (
                <span className='text-dungeon-red-500 italic'> Dues: {this_due.count} </span>
            )
        } else if (!dues) { // loading
            return (
                <span className='text-gray-700 italic'> Dues: ... </span>
            )
        }
    }

    return (
        <div className="bg-dungeon-dark-500 border border-dungeon-yellow text-2xl font-bold flex md:flex-row flex-col items-center justify-between m-5 gap-4 p-4">
            <h1>{deck.name}</h1>
            <div className='flex items-center md:flex-row flex-col gap-6'>
                {dues_ui()}

                <div className='*:p-2 *:rounded-xl *:hover:bg-dungeon-yellow *:transition-colors flex flex-row gap-2'>
                    <button className='bg-dungeon-red-900' onClick={() => {onDelete(deck.id)}}>Delete</button>
                    <button className='bg-dungeon-purple' onClick={() => {onRename(deck.id, deck.name)}}>Rename</button>
                    <button className='bg-dungeon-green-700' onClick={() => {onSelect(deck)}}>Select</button>
                </div>
            </div>
        </div>
    )
}