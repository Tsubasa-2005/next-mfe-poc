"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { client } from "@/lib/hono/client";
import { env } from "@/env";

type AuthPingOk = InferResponseType<typeof client.api.ping.$get, 200>;
type AuthPingUnauthorized = InferResponseType<typeof client.api.ping.$get, 401>;

export type RemotePingResult = {
  ok: boolean;
  status: number;
  userId?: string;
  message?: string;
};

const authPingTarget = `${env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN}/api/ping`;

function buildNetworkErrorMessage(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : String(error);

  if (rawMessage.includes("Failed to fetch")) {
    return `Request to ${authPingTarget} failed before receiving a response. Check server availability and CORS (TRUSTED_ORIGINS / allowHeaders).`;
  }

  return `Request to ${authPingTarget} failed: ${rawMessage}`;
}

async function readErrorMessage(
  response: Response
): Promise<AuthPingUnauthorized["message"] | string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json()) as Partial<AuthPingUnauthorized>;
    return body.message ?? response.statusText;
  }

  const text = await response.text();
  return text || response.statusText;
}

async function fetchRemotePing(): Promise<RemotePingResult> {
  try {
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

    const message = await readErrorMessage(response);
    return {
      ok: false,
      status: response.status,
      message,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: buildNetworkErrorMessage(error),
    };
  }
}

export function useRemotePing(enabled: boolean) {
  const query = useQuery({
    queryKey: ["remote-ping"],
    queryFn: fetchRemotePing,
    enabled,
    retry: false,
  });

  return {
    pingResult: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
