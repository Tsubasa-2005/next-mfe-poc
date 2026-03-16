import { Hono } from "hono";

export const authServerContract = new Hono().get("/api/ping", (c) => {
  return c.json({
    ok: true as const,
    message: "pong",
    userId: "contract-user-id",
  });
});

export type AuthServerAppType = typeof authServerContract;
