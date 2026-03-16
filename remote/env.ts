import { z } from "zod";

const authServerOriginSchema = z
  .string()
  .trim()
  .url("NEXT_PUBLIC_AUTH_SERVER_ORIGIN must be set. Example: http://localhost:8080")
  .transform((value) => value.replace(/\/$/, ""));

const publicEnvSchema = z.object({
  NEXT_PUBLIC_AUTH_SERVER_ORIGIN: authServerOriginSchema,
});

const serverEnvSchema = publicEnvSchema.extend({
  ALLOWED_PUBLIC_ORIGIN: z
    .string()
    .trim()
    .min(1, "ALLOWED_PUBLIC_ORIGIN must be set. Example: localhost:3000"),
  AUTH_SERVER_ORIGIN: authServerOriginSchema,
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_AUTH_SERVER_ORIGIN: process.env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN,
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}

export type AppEnv = z.infer<typeof serverEnvSchema>;
export type PublicAppEnv = z.infer<typeof publicEnvSchema>;
