import { getTransactionById } from "@/lib/actions/transaction.actions";
import { parseStringify } from "@/lib/utils";
import { NextResponse } from "next/server"
import { Client, Databases, Query } from "node-appwrite";

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // const appwriteClient = new Client()
    //     .setEndpoint("https://cloud.appwrite.io/v1")
    //     .setProject("6635581a000bb404b5fb");

    // const databases = new Databases(appwriteClient);
    // const transaction = await databases.listDocuments(
    //     process.env.APPWRITE_DATABASE_ID!, process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
    //     [Query.equal('$id', id!)]
    // );

    // const transactionData = parseStringify(transaction.documents[0]);

    // return NextResponse.json({
    //     hello: "world",
    //     id: id,
    // });

    const transactionData = await getTransactionById(id!);

    return NextResponse.json({
        transactionData
    });
}