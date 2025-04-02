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
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
