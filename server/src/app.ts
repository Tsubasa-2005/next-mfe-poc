import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.ts";
import { env } from "./env.ts";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: (origin) => (env.TRUSTED_ORIGINS.includes(origin) ? origin : null),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// better-auth のすべての認証ルートを /api/auth/* に委譲する
app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// 認証が必要な ping エンドポイント
app.get("/api/ping", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ ok: false, message: "Unauthorized" }, 401);
  }
  return c.json({ ok: true, message: "pong", userId: session.user.id });
});

app.notFound((c) => {
  return c.json(
    {
      ok: false,
      message: "Not Found",
    },
    404
  );
});

export default app;
