import { useState, useEffect } from "react";

import AccountSummary from "../components/AccountSummary";
import Decks from "../components/Decks";
import Dungeons from "../components/Dungeons";
import Sidemenu from "../components/Sidemenu";


export default function Homepage({ onNavigate }) {
    const [ subpage, setSubpage ] = useState(sessionStorage.getItem('subpage') || 'decks');

    useEffect(() => {
        sessionStorage.setItem('subpage', subpage);
    }, [subpage]);

    return (
    <>
        <div className="w-full bg-dungeon-dark-900 flex flex-col flex-1 h-auto sm:max-h-screen">
            <div className="border-dungeon-yellow border-5">
                <AccountSummary />
            </div>
            <div className="flex md:flex-row flex-col grow overflow-hidden">
                <div className="border-dungeon-yellow border-5 min-w-1/4 mb:max-w-1/4 mb:w-1/4">
                    <Sidemenu subpage={subpage} setSubpage={setSubpage} />
                </div>
                <div className="border-dungeon-yellow text-white border-5 flex flex-1">
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