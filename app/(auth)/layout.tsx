import Image from "next/image";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen w-full justify-between font-inter">
            {children}
            <div className="flex h-screen w-full sticky top-0 bg-blue-500 items-center justify-center max-lg:hidden">
                <div>
                    <Image
                        src="/icons/logo.svg"
                        height={100}
                        width={100}
                        alt="Logo"
                    />
                </div>
            </div>
        </main>
    );
}