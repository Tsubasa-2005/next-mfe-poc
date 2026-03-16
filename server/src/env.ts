import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .min(1, "PORT must be between 1 and 65535.")
    .max(65535, "PORT must be between 1 and 65535.")
    .default(8080),
  BETTER_AUTH_URL: z
    .string()
    .trim()
    .url("BETTER_AUTH_URL must be set. Example: http://localhost:8080")
    .transform((value) => value.replace(/\/$/, "")),
  BETTER_AUTH_SECRET: z.string().trim().min(1, "BETTER_AUTH_SECRET must be set."),
  DATABASE_PATH: z.string().trim().min(1, "DATABASE_PATH must be set."),
  TRUSTED_ORIGINS: z
    .string()
    .trim()
    .min(1, "TRUSTED_ORIGINS must be set. Example: http://localhost:3000,http://localhost:3001")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map((origin) => origin.replace(/\/$/, ""))
    )
    .refine((origins) => origins.length > 0, {
      message: "TRUSTED_ORIGINS must contain at least one origin.",
    })
    .superRefine((origins, ctx) => {
      for (const origin of origins) {
        let parsedOrigin: URL;
        try {
          parsedOrigin = new URL(origin);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `TRUSTED_ORIGINS contains an invalid URL: ${origin}`,
          });
          continue;
        }

        if (parsedOrigin.origin !== origin) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `TRUSTED_ORIGINS must contain origins only (no path/query/hash): ${origin}`,
          });
        }
      }
    }),
});

const parsedEnv = envSchema.parse(process.env);

export const env = parsedEnv;

export type AppEnv = typeof env;
