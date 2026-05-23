import { useState, useEffect } from "react";
import { useUser, UserAvatar } from "@clerk/clerk-react";

import { getAccountLevel, checkAccountStatus } from "../api";

export default function AccountSummary() {
    const { user } = useUser();
    const [ level, setLevel ] = useState(() => {
        checkAccountStatus(user.id); // TODO: maybe add greet for new users
        return 0;
    });

    useEffect(() => {
        getAccountLevel(user.id).then((level) => setLevel(level.level));
    }, [user?.id]);

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