import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

import { getAccountLevel, checkAccountInit } from "../services/api";

export default function AccountSummary() {
    const { user } = useUser();
    const [ level, setLevel ] = useState(() => {
        const res = checkAccountInit(); // TODO: maybe add greet for new users
        if (!res.ok) {
            return -1;
        }

        return 0;
    });

    useEffect(() => {
        // TODO: add error handling
        getAccountLevel().then(res => {
            if (!res.ok) {
                setLevel(-99999);
            }

            setLevel(res.data.level);
        })
    });

    return (
        <>
            <div className="inline-flex gap-2 items-end w-full bg-dungeon-dark-900 text-white py-6 px-12">
                <div className="scale-200 m-4">
                    <UserAvatar />
                </div>
                <div className="inline-flex gap-6 items-end">
                    <h1 className="text-5xl">{user.username}</h1>
                    <h3 className="text-2xl text-dungeon-yellow font-medium">Level: {level}</h3>
                </div>
            </div>
        </>
    )
}