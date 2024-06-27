import Link from "next/link"
import React from 'react'
import { Tabs, TabsList } from "./ui/tabs"
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import { BankTabItem } from "./BankTabItem"
import BankInfo from "./BankInfo"
import TransactionTable from "./TransactionTable"
import { Pagination } from "./Pagination"

const RecentTransactions = ({
    accounts,
    transactions,
    appwriteItemId,
    page,
}: RecentTransactionsProps) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);

    const indexOfLastTransaction = page * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

    const currentTransaction = transactions.slice(
        indexOfFirstTransaction, indexOfLastTransaction
    );

    return (
        <section className="recent-transactions mt-5">
            <header className="flex items-center justify-between">
                <h2 className="recent-transactions-label">
                    Recent transactions
                </h2>

            </header>

            <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className="recent-transactions-tablist">
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem
                                key={account.id}
                                account={account}
                                appwriteItemId={appwriteItemId}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {accounts.map((account: Account) => (
                    <TabsContent
                        value={account.appwriteItemId}
                        key={account.id}
                        className="space-y-4"
                    >
                        <BankInfo
                            account={account}
                            appwriteItemId={appwriteItemId}
                            type="full"
                        />

                        <TransactionTable transactions={currentTransaction} />

                        {totalPages > 1 && (
                            <div className="my-4 w-full">
                                <Pagination
                                    totalPages={totalPages}
                                    page={page}
                                />
                            </div>
                        )}
                    </TabsContent>
                ))}

            </Tabs>
        </section>
    )
}

export default RecentTransactions