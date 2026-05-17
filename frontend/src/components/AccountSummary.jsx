import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

const API = import.meta.env.VITE_API_URL;

function AccountSummary() {
    const { user } = useUser();
    const [ account_level, setAccountLevel ] = useState(0);

    useEffect(() => {
        fetch(`${API}/api/decks?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                let sum = 0;
                data.forEach(deck => {
                    sum += (deck.level || 0);
                });
                setAccountLevel(sum);
            });
    }, [user?.id]);

    return (
        <>
            <div className="inline-flex gap-2 items-end w-full bg-gray-500 text-white py-6 px-12">
                <div className="scale-200 m-4">
                    <UserAvatar />
                </div>
                <div className="inline-flex gap-4 items-end">
                    <h1 className="text-5xl">{user.username}</h1>
                    <h3 className="text-2xl font-medium">Level: {account_level}</h3>
                </div>
            </div>
        </>
    )
}

export default AccountSummary;