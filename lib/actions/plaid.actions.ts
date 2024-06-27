"use server";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { calculateCheckDigit, encryptId, generateBankAccountNumber, parseStringify } from "../utils";
import { plaidClient } from "../plaid";
import { addFundingSource } from "./dwolla.action";
import { createBankAccount } from "../appwrite";
import { revalidatePath } from "next/cache";

export const createLinkToken = async (user: User) => {
    try {
        const request = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(request);

        return parseStringify({ linkToken: response.data.link_token })
    } catch (error) {
        console.log('Error createLinkToken', error);
    }
}

export const exchangePublicToken = async ({
    publicToken, user,
}: exchangePublicTokenProps) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        }

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw Error;

        const extractFundingSourceUrl = fundingSourceUrl.headers.get("location");

        if (!extractFundingSourceUrl) throw Error;

        const bankAcocuntNumber = generateBankAccountNumber();
        const bankAccountNumberCheckDigit = calculateCheckDigit(bankAcocuntNumber);
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accountNumber: `${bankAcocuntNumber}${bankAccountNumberCheckDigit}`,
            accessToken,
            fundingSourceUrl: extractFundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        revalidatePath("/");

        return parseStringify({
            publicTokenExchange: "complete",
        });
    } catch (error) {
        console.log('Error exchangePublicToken', error);
    }
}