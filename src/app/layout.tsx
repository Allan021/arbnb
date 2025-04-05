import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import ClientLayout from "@/components/ui/cliente-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "nomhy",
  description: "Un servicio de alquiler de propiedades en línea",
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
        <meta name="theme-color" content="#008259" />
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
