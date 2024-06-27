"use server";
import { Client, Account, Databases, Users, Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "./utils";

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get("appwrite-session");
    if (!session || !session.value) {
        throw new Error("No session");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
    };
}

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        },
        get user() {
            return new Users(client);
        }
    };
}

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!, process.env.APPWRITE_USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        );

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.log('Error getUserInfo', error);
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        const user = await getUserInfo({ userId: result.$id });

        return parseStringify(user);
    } catch (error) {
        console.log('Error getLoggedInUser', error);
        return null;
    }
}

export const createBankAccount = async ({
    userId, bankId, accountId, accountNumber, accessToken, fundingSourceUrl, shareableId
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId, bankId, accountId, accountNumber, accessToken, fundingSourceUrl, shareableId
            }
        );

        return parseStringify(bankAccount);
    } catch (error) {
        console.log('Error createBankAccount', error);
    }
}

export const getBanks = async ({ userId }: getBanksProps) => {
    try {
        const { database } = await createAdminClient();

        const banks = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        );

        return parseStringify(banks.documents);
    } catch (error) {
        console.log('Error getBanks', error);
    }
}

export const getBank = async ({ documentId }: getBankProps) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        );

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log('Error getBank', error);
    }
}

export const getBankByAccountNumber = async ({ accountNumber }: getBankByAccountNumberProps) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('accountNumber', [accountNumber])]
        );

        if (bank.total !== 1) return null;

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log('Error getBankByAccountNumber', error);
    }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        )

        if (bank.total !== 1) return null;

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log('Error getBankByAccountId', error)
    }
}