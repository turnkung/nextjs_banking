"use server";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient, getUserInfo } from "../appwrite";
import { cookies } from "next/headers";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { createDwollaCustomer } from "./dwolla.action";

import { faker } from '@faker-js/faker';

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId });

        return parseStringify(user);
    } catch (error) {
        console.log('Error signIn', error);
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;

    let newUserAccount;
    try {
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`);

        if (!newUserAccount) throw new Error('Error creating user while Sign Up');

        const d = faker.date.birthdate({ min: 18, max: 65, mode: 'age', refDate: 'string' });
        const dwollaCustomerUrl = await createDwollaCustomer({
            firstName: firstName,
            lastName: lastName,
            email: email,
            // Using Faker
            address1: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            postalCode: faker.location.zipCode(),
            dateOfBirth: [d.getFullYear(), d.getMonth(), d.getDate()].join("-"),
            ssn: faker.number.int({ min: 1000, max: 5000 }).toString(),
            type: 'personal'
        });
        if (!dwollaCustomerUrl) throw new Error('Error creating Dwolla Customer');

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!, process.env.APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl,
            }
        );

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (error) {
        console.log('Error signUp', error);
    }
}

export const logout = async () => {
    try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) {
        console.log('Error logout', error);
        return null;
    }
}