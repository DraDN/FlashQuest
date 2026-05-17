
export default function DeckEditor({ deck, onNavigate }) {
    return (
        <>
            <div>
                <h1>Deck Editor - {deck.name}</h1>
                <button onClick={() => onNavigate('home')}>go back</button>
            </div>
        </>
    )
}