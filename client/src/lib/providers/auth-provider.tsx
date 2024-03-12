"use client";

import {apiService} from "@/lib/services/api-service";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, accessTokenRaw } = useKindeBrowserClient();

  useEffect(() => {
    apiService.setAccessToken(accessTokenRaw ?? "");
  }, [accessTokenRaw]);

  if (isLoading) return null; // TODO: return loading component
  return children;
}
