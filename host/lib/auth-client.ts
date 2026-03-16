import { createAuthClient } from "better-auth/react";

export function createHostAuthClient(authServerOrigin: string) {
  return createAuthClient({
    baseURL: authServerOrigin,
    basePath: "/api/auth",
    fetchOptions: {
      credentials: "include",
    },
  });
}
