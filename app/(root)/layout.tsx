import { Header } from "@/components/Header";
import { getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

const RootLayout = async ({ children }: Props) => {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) redirect("/sign-in");

    return (
        <>
            <Header user={loggedInUser} />
            <main className="px-3 lg:px-14">
                {children}
            </main>
        </>
    )
}

export default RootLayout;