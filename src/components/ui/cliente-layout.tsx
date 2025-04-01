"use client";

import React from "react";
import { AuthProvider } from "@/lib/AuthContext"; // ✅ Aquí sí se puede importar
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">{children}</div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
