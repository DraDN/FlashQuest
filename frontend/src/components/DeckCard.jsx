import { calculateNextLevelProgression } from '../utils/xp_utils';

export default function DeckCard({ deck, onSelect, onRename, onDelete }) {
    return (
        <div className="bg-dungeon-dark-500 border border-dungeon-yellow text-2xl font-bold flex items-center justify-between m-5 gap-4 p-4">
            <div className="w-full space-y-2">
                <div className='flex flex-row gap-2 items-end grow'>
                    <h1>{deck.name}</h1>
                    <h2 className='shrink-0 font-semibold text-sm text-dungeon-yellow-glow m-1'>LVL {deck.level}</h2>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='relative space-y-1.5 grow bg-dungeon-dark-900 border border-dungeon-yellow-glow rounded-xl'>
                        <div className="w-full h-4.5 flex grow">
                            {deck.xp > 0 && (
                                <div className="flex flex-row bg-linear-to-r from-dungeon-yellow to-dungeon-yellow-glow rounded-xl transition-all duration-500 ease-out" style={{ width: `${calculateNextLevelProgression(deck.xp, deck.level)}%` }}></div>
                            )}
                        </div>
                    </div>
                    <h2 className='font-medium text-sm text-dungeon-yellow-glow'>XP {deck.xp}</h2>
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