import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

function Header() {
    return (
        <>
            <header className="items-end bg-dungeon-dark-500 text-white">
                <div className="flex items-center justify-end px-6 py-3">
                <SignedOut>
                    <div className="flex gap-4">
                    <SignInButton />
                    <SignUpButton />
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton appearance={{
                        elements: {
                            avatarBox: {
                                width: 40,
                                height: 40,
                            }
                        }
                    }} />
                </SignedIn>
                </div>
            </header>
        </>
    )
}

export default Header;