"use client";

import { authClient } from "../../lib/auth-client";
import { useRemotePing } from "../../lib/hooks/use-remote-ping";

export default function RemoteZoneHome() {
  const { data, error, isPending } = authClient.useSession();
  const sessionId = data?.session?.id ?? null;
  const {
    pingResult,
    isLoading: isPingLoading,
    error: pingError,
  } = useRemotePing(Boolean(sessionId));
  const isLoading = isPending || isPingLoading;
  const isSuccess = Boolean(pingResult?.ok && !error && !pingError);

  return (
    <main className="min-h-screen bg-white p-4 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-md border border-slate-200 p-4">
        <h1 className="text-xl font-semibold">Remote</h1>
        <p className="mt-3 text-sm">
          {isLoading ? "Loading..." : isSuccess ? "Success" : "Failed"}
        </p>
      </div>
    </main>
  );
}
