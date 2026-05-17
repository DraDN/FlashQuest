import { useState } from "react";
// import { useUser } from "@clerk/clerk-react";

import AccountSummary from "../components/AccountSummary";
import Decks from "../components/Decks";
import Dungeons from "../components/Dungeons";
import Sidemenu from "../components/Sidemenu";


export default function Homepage({ onNavigate }) {
    const [ subpage, setSubpage ] = useState('decks');

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
                    {subpage === 'decks' && (
                        <Decks onDeckSelect={(deck) => {onNavigate('deck-editor', deck)}}/>
                    )}
                    {subpage === 'dungeons' && (
                        <Dungeons onDungeonSelect={(dungeon) => {onNavigate('dungeon', dungeon)}}/>
                    )}
                </div>
            </div>
        </div>
    </>);
}