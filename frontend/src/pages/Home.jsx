import { useState } from "react";
// import { useUser } from "@clerk/clerk-react";

import AccountSummary from "../components/AccountSummary";
import Decks from "../components/Decks";
import Dungeons from "../components/Dungeons";
import Sidemenu from "../components/Sidemenu";
// import Dungeon from "./Dungeon";


function Homepage({ onNavigate }) {
    // const { user } = useUser();
    const [ subpage, setSubpage ] = useState('home');

    return (
    <>
        <div className="w-full bg-gray-950 flex flex-col">
            <div className="border-gray-700 border-5">
                <AccountSummary />
            </div>
            <div className="flex md:flex-row flex-col grow">
                <div className="border-gray-700 border-5 min-w-1/4">
                    <Sidemenu subpage={subpage} setSubpage={setSubpage} />
                </div>
                <div className="border-gray-700 text-white border-5 grow relative">
                    {subpage === 'home' && (
                        <h1>Welcome back!</h1>
                    )}
                    {subpage === 'decks' && (
                        <Decks />
                    )}
                    {subpage === 'dungeons' && (
                        // <div>
                            // <h1>Dungeons</h1>
                            // <button onClick={() => onNavigate('dungeon')}>go there</button>
                        // </div>
                        <Dungeons />
                    )}
                </div>
            </div>
        </div>
    </>);
}

export default Homepage