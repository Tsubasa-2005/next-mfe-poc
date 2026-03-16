"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { client } from "@/lib/hono/client";

type AuthPingOk = InferResponseType<typeof client.api.ping.$get, 200>;
type AuthPingUnauthorized = InferResponseType<typeof client.api.ping.$get, 401>;

export type AuthPingResult = {
  ok: boolean;
  status: number;
  userId?: string;
  message?: string;
};

async function fetchAuthPing(): Promise<AuthPingResult> {
  const response = await client.api.ping.$get();

  if (response.ok) {
    const body = (await response.json()) as AuthPingOk;
    return {
      ok: true,
      status: response.status,
      userId: body.userId,
      message: body.message,
    };
  }

  const body = (await response.json()) as AuthPingUnauthorized;
  return {
    ok: false,
    status: response.status,
    message: body.message,
  };
}

export function useAuthPing(enabled: boolean) {
  const query = useQuery({
    queryKey: ["host-auth-ping"],
    queryFn: fetchAuthPing,
    enabled,
  });

  return {
    pingResult: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
