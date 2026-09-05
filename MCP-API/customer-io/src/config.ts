import { z } from "zod";

const Env = z.object({
  CUSTOMERIO_APP_API_KEY: z.string().min(1),
  CUSTOMERIO_REGION: z.enum(["us", "eu"]).default("us"),
  CUSTOMERIO_WORKSPACE_ID: z.string().regex(/^\d+$/).optional(),
  CUSTOMERIO_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  CUSTOMERIO_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  CUSTOMERIO_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  CUSTOMERIO_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  CUSTOMERIO_APPROVED_ACTIONS: z.string().default("")
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = Env.parse(env);
  return {
    apiKey: v.CUSTOMERIO_APP_API_KEY,
    region: v.CUSTOMERIO_REGION,
    baseUrl: v.CUSTOMERIO_REGION === "eu" ? "https://api-eu.customer.io" : "https://api.customer.io",
    officialMcpUrl: v.CUSTOMERIO_REGION === "eu" ? "https://mcp-eu.customer.io/mcp" : "https://mcp.customer.io/mcp",
    workspaceId: v.CUSTOMERIO_WORKSPACE_ID,
    timeoutMs: v.CUSTOMERIO_TIMEOUT_MS,
    maxRetries: v.CUSTOMERIO_MAX_RETRIES,
    requireWriteApproval: v.CUSTOMERIO_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: v.CUSTOMERIO_ALLOW_DESTRUCTIVE === "true",
    approvedActions: new Set(v.CUSTOMERIO_APPROVED_ACTIONS.split(";").map(x => x.trim()).filter(Boolean))
  };
}
export type Config = ReturnType<typeof loadConfig>;
