import { z } from "zod";

const schema = z.object({
  PLANETSCALE_MCP_URL: z.string().url().default("https://mcp.pscale.dev/mcp"),
  PLANETSCALE_MCP_TOKEN: z.string().min(1),
  PLANETSCALE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  PLANETSCALE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  PLANETSCALE_APPROVAL_SECRET: z.string().min(16).optional(),
  PLANETSCALE_ENABLE_WRITE: z.enum(["true", "false"]).default("false")
});

export type Config = ReturnType<typeof loadConfig>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = schema.parse(env);
  const url = new URL(v.PLANETSCALE_MCP_URL);
  if (url.protocol !== "https:" || !["mcp.pscale.dev", "mcp.planetscale.com"].includes(url.hostname)) {
    throw new Error("PLANETSCALE_MCP_URL must be an official PlanetScale HTTPS MCP host");
  }
  return { ...v, enableWrite: v.PLANETSCALE_ENABLE_WRITE === "true" };
}
