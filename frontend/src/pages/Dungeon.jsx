
function Dungeon({ onNavigate }) {
    return (
        <>
            <div>
                <h1>Dungeon</h1>
                <button onClick={() => onNavigate('home')}>go back</button>
            </div>
        </>
    )
}

export default Dungeon;