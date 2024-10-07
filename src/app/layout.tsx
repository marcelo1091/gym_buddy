import Head from "next/head";
import "./globals.css";
import React from "react";
import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gym Buddy",
  description: "Gym buddy app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Gym Buddy</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </Head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
