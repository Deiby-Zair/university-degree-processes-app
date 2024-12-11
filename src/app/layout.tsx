import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/utils/thirdweb";
import { AuthProvider } from "../context/context";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Document Management",
    description: "Application destinated to manage grade process in Universidad del Cauca",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="es">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
                    rel="stylesheet" />
            </Head>
            <body className={inter.className}>
                <ThirdwebProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThirdwebProvider>
            </body>
        </html>
    );
}