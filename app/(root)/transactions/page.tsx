import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/appwrite";
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import TransactionTable from "@/components/TransactionTable";
import { formatAccountNumber, formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { Pagination } from "@/components/Pagination";


const TransactionPage = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const currentPage = Number(page as string) || 1;;
    const loggedInUser = await getLoggedInUser();
    const accounts = await getAccounts({
        userId: loggedInUser.$id,
    });

    if (!accounts) return;

    const accountsData = accounts?.data;

    const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

    const account = await getAccount({ appwriteItemId });

    const rowsPerPage = 10;
    const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

    const indexOfLastTransaction = currentPage * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

    const currentTransaction = account?.transactions.slice(
        indexOfFirstTransaction, indexOfLastTransaction
    );

    return (
        // <div className="transactions -mt-24">
        //     <div className="transactions-header">
        //         <div className="header-box">
        //             <h1 className="header-box-title">Transaction History</h1>
        //             <p className="header-box-subtext">
        //                 See your bank transactions.
        //             </p>
        //         </div>
        //     </div>

        //     <div className="space-y-6">
        //         <div className="transactions-account">
        //             <div className="flex flex-col gap-2">
        //                 <h2 className="text-18 font-bold text-white">
        //                     {account?.data.name}
        //                 </h2>
        //                 <p className="text-14 text-blue-25">
        //                     {account?.data.officialName}
        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="-mt-24">
            <Card className="bg-white">
                <CardHeader>
                    <div className="transactions-header">
                        <div className="header-box">
                            <h2 className="text-2xl font-bold">Transaction</h2>
                            <p className="header-box-subtext">
                                See your account details and transactions.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6 mt-8">
                        <div className="transactions-account">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-18 font-bold text-white">{account?.data.name}</h2>
                                <p className="text-14 text-blue-25">{account?.data.officialName}</p>
                                <p className="text-14 font-semibold tracking-[1.1px] text-white">{formatAccountNumber(account?.data.accountNumber)}</p>
                            </div>

                            <div className="transactions-account-balance">
                                <p className="text-14">Current balance</p>
                                <p className="text-24 text-center">
                                    {formatAmount(account?.data.currentBalance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger><Button className="text-16 rounded-lg border border-none bg-gray-800 font-semibold text-white shadow-form; w-full">Create new transaction</Button></DialogTrigger>
                        <DialogContent className="bg-white min-w-[40%] w-[400px] max-h-[80%]">
                            <DialogHeader>
                                <div className="header-box">
                                    <h2 className="text-2xl font-bold">Create new transaction</h2>
                                    <p className="header-box-subtext">
                                        Please provide any specific details or note related to the payment transfer.
                                    </p>
                                </div>
                            </DialogHeader>

                            <ScrollArea className="md:h-3/6 lg:h-4/6 overflow-auto">
                                <div className="size-full pt-5 ml-12 justify-center items-center">
                                    <PaymentTransferForm accounts={accountsData} />
                                </div>
                            </ScrollArea>

                        </DialogContent>
                    </Dialog>

                </CardHeader>
                <CardContent>
                    <div className="flex w-full flex-col gap-6">
                        <TransactionTable
                            transactions={currentTransaction} />
                        {totalPages > 1 && (
                            <div className="my-4 w-full">
                                <Pagination
                                    totalPages={totalPages}
                                    page={currentPage}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionPage