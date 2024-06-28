"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
    APPWRITE_DATABASE_ID: DATABSE_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env

export const createTransaction = async (transaction: CreateTransactionProps) => {
    try {
        const { database } = await createAdminClient();
        const newTransaction = await database.createDocument(
            DATABSE_ID!, TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                channel: 'online',
                category: 'Transfer',
                ...transaction,
            }
        )

        return parseStringify(newTransaction);
    } catch (error) {
        console.log('Error createTransaction', error);
    }
}

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
    try {
        const { database } = await createAdminClient();

        const senderTransactions = await database.listDocuments(
            DATABSE_ID!, TRANSACTION_COLLECTION_ID!,
            [Query.equal('senderBankId', bankId)],
        );

        const receiverTransactions = await database.listDocuments(
            DATABSE_ID!, TRANSACTION_COLLECTION_ID!,
            [Query.equal('receiverBankId', bankId)],
        );

        const transactions = {
            total: senderTransactions.total + receiverTransactions.total,
            documents: [
                ...senderTransactions.documents,
                ...receiverTransactions.documents,
            ]
        }

        return parseStringify(transactions);
    } catch (error) {
        console.error('Error getTransactionsByBankId', error);
    }
}

export const getTransactionById = async (transactionId: string) => {
    try {
        const { database } = await createAdminClient();
        const transactionData = await database.listDocuments(
            DATABSE_ID!, TRANSACTION_COLLECTION_ID!,
            [Query.equal('$id', transactionId)]
        );
        return parseStringify(transactionData.documents[0]);
    } catch (error) {
        console.error('Error getTransactionById', error);
    }
}