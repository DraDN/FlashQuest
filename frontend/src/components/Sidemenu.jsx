import { useUser } from "@clerk/clerk-react";

function Sidemenu({ subpage, setSubpage }) {
    const { user } = useUser();
    console.log(subpage);

    return (
        <>
            <div className="text-white font-extralight p-12 flex flex-col gap-10">
                <p className="text-3xl">Welcome, <i>{user.firstName}</i></p>
                <button className={`${subpage === 'decks' ? "bg-red-500" : "bg-blue-500"} p-5 rounded-xl hover:bg-green-500 transition-colors`} onClick={() => setSubpage('decks')}>Decks</button>
                <button className={`${subpage === 'dungeons' ? "bg-red-500" : "bg-blue-500"} p-5 rounded-xl hover:bg-green-500 transition-colors`} onClick={() => setSubpage('dungeons')}>Dungeons</button>
            </div>
        </>
    )
}

export default Sidemenu;