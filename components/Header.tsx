"use client";
import Image from "next/image"
import Link from "next/link"
import Navigation from "./Navigation"
import WelcomeBox from "./WelcomeBox";
import UserButton from "./UserButton";

type Props = {
    user: User;
}

export const Header = ({ user }: Props) => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 py-8 px-4 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        {/* Logo */}
                        <Link href="/">
                            <div className="items-center hidden lg:flex">
                                <Image
                                    src="/icons/logo.svg"
                                    height={28}
                                    width={28}
                                    alt="Logo" />
                                <p className="font-semibold text-white text-2xl ml-2.5">
                                    Simple Wallet
                                </p>
                            </div>
                        </Link>
                        <Navigation />
                    </div>
                    {/* <div className="profile-banner" /> */}
                    {/* <div className="profile">
                        <div className="profile-img">
                            <span className="text-5xl font-bold text-blue-500"></span>
                        </div>
                    </div> */}
                    <UserButton user={user} />
                </div>

                <WelcomeBox user={user} />

            </div>
        </header>
    )
}