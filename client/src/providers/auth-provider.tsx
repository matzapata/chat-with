"use client";

import apiClient from "@/config/api-client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, accessTokenRaw } = useKindeBrowserClient();

  useEffect(() => {
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessTokenRaw}`;
  }, [accessTokenRaw]);

  if (isLoading) return null; // TODO: return loading component
  return children;
}
