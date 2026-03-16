import { createAuthClient } from "better-auth/react";
import { env } from "../env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});
