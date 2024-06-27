import { DataGrid } from "@/components/DataGrid"
import RecentTransactions from "@/components/RecentTransactions"
import TotalBalanceBox from "@/components/TotalBalanceBox"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/appwrite"
import React from 'react'

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const currentPage = Number(page as string) || 1;
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) return;

    const accounts = await getAccounts({
        userId: loggedInUser.$id,
    });

    const accountsData = accounts?.data;

    const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

    const account = await getAccount({ appwriteItemId });

    return (
        <>
            <TotalBalanceBox
                accounts={accountsData}
                totalBanks={accounts?.totalBanks}
                totalCurrentBalance={accounts?.totalCurrentBalance}
            />

            <div className="mt-10 flex flex-1 flex-col gap-6">
                <h2 className="top-categories-label">Top categories</h2>
                <div className="space-y-5">
                    <div className="max-w-screen-2xl mx-auto w-full">
                        <DataGrid transactions={account?.transactions} />
                    </div>
                </div>
            </div>

            <RecentTransactions
                accounts={accountsData}
                transactions={account?.transactions}
                appwriteItemId={appwriteItemId}
                page={currentPage}
            />
        </>
        // <section className="home">
        //     <div className="home-content">

        //     </div>
        // </section>
        // <div className="max-w-screen-2xl mx-auto w-11/12 pb-10 -mt-24">
        //     <Card className="border-none drop-shadow-sm bg-white">
        //         <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        //             <header className="home-header space-y-2">
        //             </header>
        //         </CardHeader>
        //     </Card>
        // </div>
    )
}

export default Home