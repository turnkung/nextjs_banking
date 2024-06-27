"use client";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { logout } from "@/lib/actions/user.action"
import Image from "next/image"
import { useRouter } from "next/navigation"
import PlaidLink from "./PlaidLink";

const UserButton = ({ user }: UserButtonProps) => {
    const router = useRouter();
    const handleLogOut = async () => {
        const loggedOut = await logout();

        if (loggedOut) router.push('/sign-in');
    }
    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <div className="profile">
                        <div className="profile-img">
                            <span className="text-2xl font-bold text-blue-500">{user?.firstName[0]}</span>
                        </div>
                    </div></SheetTrigger>
                <SheetContent className="border-none bg-white">
                    <SheetClose asChild>
                        <nav className="flex h-full flex-col gap-6 pt-15">
                            <SheetClose asChild key="logout">
                                <div className="mobilenav-sheet_colse w-full border-cyan-100" onClick={handleLogOut}>
                                    <Image
                                        src="/icons/logout.svg"
                                        alt="Sign Out"
                                        width={20}
                                        height={20}
                                    />
                                    <p>Sign Out</p>
                                </div>
                            </SheetClose>
                            <SheetClose asChild key="connect-bank">
                                <div>
                                    <PlaidLink user={user} />
                                </div>
                            </SheetClose>
                        </nav>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default UserButton