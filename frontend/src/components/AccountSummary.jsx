import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

import { useUserData } from "../store/store";

export default function AccountSummary() {
    const { user } = useUser();

    const coins = useUserData(state => state.coins);
    const getCoins = useUserData(state => state.getCoins);
    const checkAccount = useUserData(state => state.checkAccount);

    const [ accountError, setAccountError ] = useState(null);

    useEffect(() => {
        try {
            checkAccount().then(getCoins());
        } catch (err) {
            setAccountError(err.message);
        }
    }, [user?.id]);

    return (
        <>
            <div className="inline-flex gap-2 items-end w-full bg-dungeon-dark-900 text-white py-6 px-12">
                <div className="scale-200 m-4">
                    <UserAvatar />
                </div>
                <div className="inline-flex gap-6 items-end">
                    <h1 className="text-5xl">{user.username}</h1>
                    {accountError ? (
                        <h2 className="text-2xl text-dungeon-red-500">{accountError}</h2>
                    ) : (
                        <h3 className="text-2xl text-dungeon-yellow font-medium">Coins: {coins}</h3>
                    )}
                </div>
            </div>
        </>
    )
}