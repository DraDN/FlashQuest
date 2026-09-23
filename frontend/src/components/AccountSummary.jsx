import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

import { getAccountCoins, checkAccountInit } from "../services/api";

export default function AccountSummary() {
    const { user } = useUser();
    const [ coins, setCoins ] = useState(0);

    useEffect(() => {
        checkAccountInit().then(res => {
            if (!res.ok) {
                setCoins(-1);
                return;
            }

            // TODO: add error handling
            getAccountCoins().then(res => {
                if (!res.ok) {
                    setCoins(-99999);
                }

                setCoins(res.data.coins);
            })
        })
    }, [user?.id]);

    return (
        <>
            <div className="inline-flex gap-2 items-end w-full bg-dungeon-dark-900 text-white py-6 px-12">
                <div className="scale-200 m-4">
                    <UserAvatar />
                </div>
                <div className="inline-flex gap-6 items-end">
                    <h1 className="text-5xl">{user.username}</h1>
                    <h3 className="text-2xl text-dungeon-yellow font-medium">Coins: {coins}</h3>
                </div>
            </div>
        </>
    )
}