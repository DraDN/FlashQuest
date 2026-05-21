import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

function AccountSummary() {
    const { user } = useUser();
    const [ account_level, setAccountLevel ] = useState(0);

    useEffect(() => {
        fetch(`/api/decks?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                let sum = 0;
                data.forEach(deck => {
                    sum += (deck.level || 0);
                });
                setAccountLevel(sum);
            });
    });

    return (
        <>
            <div className="inline-flex gap-2 items-end w-full bg-dungeon-dark-900 text-white py-6 px-12">
                <div className="scale-200 m-4">
                    <UserAvatar />
                </div>
                <div className="inline-flex gap-4 items-end">
                    <h1 className="text-5xl">{user.username}</h1>
                    <h3 className="text-2xl text-dungeon-yellow font-medium">Level: {account_level}</h3>
                </div>
            </div>
        </>
    )
}

export default AccountSummary;