"use client";

import React from "react";
import AuthProvider from "./auth-provider";
import QueryProvider from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
