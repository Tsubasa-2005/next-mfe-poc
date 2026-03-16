import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { env } from "./env.ts";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: new Database(env.DATABASE_PATH),
  trustedOrigins: env.TRUSTED_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
});
