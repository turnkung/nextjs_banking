"use client";
import Link from "next/link"
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "./ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const fromSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof fromSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    email: data.email!,
                    password: data.password!
                }
                const newUser = await signUp(userData);

                setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response) {
                    setIsSuccess(true);
                    router.push("/");
                }
            }
        } catch (error) {
            console.error('Erro signInOnSubmit', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isSuccess && (
                <div className="flex absolute size-full items-center justify-center bg-white opacity-75">
                    <Loader2 size={50} className="text-gray-500 animate-spin" />
                </div>
            )}

            <section className="auth-form -mt-30">
                <div className="h-full lg:flex flex-col items-center justify-center px-4">
                    <div className="text-center space-y-4 pt-16">
                        <h1 className="font-bold text-3xl text-[#2E2A47]">
                            Welcome!
                        </h1>
                        {!user && (
                            <p className="text-base text-[#7E8CA0]">
                                Please sign in or create account to continue.
                            </p>
                        )}
                    </div>
                </div>
                {/* <header className="flex flex-col gap-5">
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Simple Wallet Logo" />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                        Simple Wallet
                    </h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In' : 'Sign Up'}
                        <p className="text-16 font-normal text-gray-600">
                            {user ? 'Link your account to get started'
                                : 'Please enter your details'}
                        </p>
                    </h1>
                </div>
            </header> */}
                {user ? (<div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                    <div className="text-center space-y-4 pt-16">
                        <p className="text-base text-left text-[#7E8CA0]">
                            <b>Note:</b> Before continue i would recommended to choose &quot;CHASE&quot; in select institution step.
                            And in login process you can skip the sign in step by click &quot;Sign in&quot; button
                            without filling any information then click &quot;Get code&quot; and &quot;Submit&quot;
                            and then select the account you want then click &quot;Continue&quot; and follows the remain steps.
                        </p>
                    </div>
                </div>) : (
                    <>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {type === 'sign-up' && (
                                    <>
                                        <div className="flex gap-4">
                                            <CustomInput control={form.control} name="firstName" label="First Name"
                                                placeholder="Enter your first name" />
                                            <CustomInput control={form.control} name="lastName" label="Last Name"
                                                placeholder="Enter your last name" />
                                        </div>
                                    </>
                                )}

                                <CustomInput control={form.control} name="email" label="Email"
                                    placeholder="Enter your email" />

                                <CustomInput control={form.control} name="password" label="Password"
                                    placeholder="Enter your password" />

                                <div className="flex flex-col gap-4">
                                    <Button type="submit" className="form-btn" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />&nbsp;
                                                {type === 'sign-in' ? 'Signing In...' : 'Signing Up...'}
                                            </>
                                        ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                        <footer className="flex justify-center gap-1">
                            <p className="text-14 font-normal text-gray-600">
                                {type === 'sign=in' ? "Don't have an account?"
                                    : "Already have an account?"}
                            </p>
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                                {type === 'sign-in' ? "Sign Up" : "Sign In"}
                            </Link>
                        </footer>
                        {type === 'sign-up' && (
                            <div className="flex flex-col">
                                <p className="text-base text-[#7E8CA0]">
                                    <b>Note: </b>Your information will not be used and no need to fill in actual information.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    )
}

export default AuthForm