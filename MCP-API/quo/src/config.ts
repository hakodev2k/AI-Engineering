import { z } from "zod";

const envSchema = z.object({
  QUO_API_KEY: z.string().min(1),
  QUO_API_BASE_URL: z.string().url().default("https://api.openphone.com/v1"),
  QUO_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  QUO_APPROVE_WRITES: z.string().default("false").transform(v => v === "true"),
  QUO_APPROVE_HIGH_RISK: z.string().default("false").transform(v => v === "true"),
  QUO_ENABLE_DESTRUCTIVE: z.string().default("false").transform(v => v === "true")
});

export type QuoConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): QuoConfig {
  return envSchema.parse(env);
}
