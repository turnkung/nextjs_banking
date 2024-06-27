"use server";
import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
    const environment = process.env.DWOLLA_ENV as string;

    switch (environment) {
        case "sandbox":
            return "sandbox";
        case "production":
            return "production";
        default:
            throw new Error(
                "Dwolla environment should either be set to `sandbox` or `production`"
            );
    }
}

const dwollaClient = new Client({
    environment: getEnvironment(),
    key: process.env.DWOLLA_KEY as string,
    secret: process.env.DWOLLA_SECRET as string,
});

export const createFundingSource = async (
    options: CreateFundingSourceOptions
) => {
    try {
        return await dwollaClient.post(
            `customers/${options.customerId}/funding-sources`, {
            name: options.fundingSourceName,
            plaidToken: options.plaidToken,
        });
    } catch (error) {
        console.log('Error crateFundingSource', error);
    }
}

export const createOnDemandAuthorization = async () => {
    try {
        const onDemandAuthorization = await dwollaClient.post(
            "on-demand-authorizations"
        );
        const authLink = onDemandAuthorization.body._links;
        return authLink;
    } catch (error) {
        console.log('Error createOnDemandAuthorization', error);
    }
}

export const createDwollaCustomer = async (
    newCustomer: NewDwollaCustomerParams
) => {
    try {
        return await dwollaClient
            .post("customers", newCustomer)
            .then((res) => res.headers.get("location"));
    } catch (error) {
        console.log('Error createDwollaCustomer', error);
    }
}

export const addFundingSource = async ({
    dwollaCustomerId,
    processorToken,
    bankName,
}: AddFundingSourceParams) => {
    try {
        const dwollaAuthLinks = await createOnDemandAuthorization();

        const fundingSourceOptions = {
            customerId: dwollaCustomerId,
            fundingSourceName: bankName,
            plaidToken: processorToken,
            _links: dwollaAuthLinks,
        }
        return await createFundingSource(fundingSourceOptions);
    } catch (error) {
        console.log('Error addFundingSource', error);
    }
}

export const createTransfer = async ({
    sourceFundingSourceUrl, destinationFundingSourceUrl, amount
}: TransferParams) => {
    try {
        const request = {
            _links: {
                source: {
                    href: sourceFundingSourceUrl,
                },
                destination: {
                    href: destinationFundingSourceUrl,
                },
            },
            amount: {
                currency: "USD",
                value: amount,
            },
        }

        return await dwollaClient.post(
            "transfers", request).then((res) => res.headers.get("location"));
    } catch (error) {
        console.error('Error createTransfer', error);
    }
}