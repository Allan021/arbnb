import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import ClientLayout from "@/components/ui/cliente-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Place it",
  description: "Un clon de AirBnB creado con Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning={true} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Un clon de AirBnB creado con Next.js"
        />
        <meta name="theme-color" content="#FF385C" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="your-verification-code"
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
