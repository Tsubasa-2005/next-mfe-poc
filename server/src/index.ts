import { serve } from "@hono/node-server";
import app from "./app.ts";
import { env } from "./env.ts";

const port = env.PORT;
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Demo auth server listening on http://localhost:${info.port}/api/auth/get-session`);
  }
);
