import { env } from "@/env";
import { hc } from "hono/client";
import type { AuthServerAppType } from "../../../server/src/contract";

const getBaseURL = () => {
  return env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN;
};

export const client = hc<AuthServerAppType>(getBaseURL(), {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});
