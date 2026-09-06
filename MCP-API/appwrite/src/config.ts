import { z } from "zod";

const Env = z.object({
  APPWRITE_MCP_URL: z.string().url().default("https://mcp.appwrite.io/"),
  APPWRITE_MCP_ACCESS_TOKEN: z.string().optional().default(""),
  APPWRITE_ENDPOINT: z.string().url().optional().default(""),
  APPWRITE_PROJECT_ID: z.string().optional().default(""),
  APPWRITE_API_KEY: z.string().optional().default(""),
  APPWRITE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  APPWRITE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  APPWRITE_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  APPWRITE_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  APPWRITE_APPROVED_ACTIONS: z.string().default("")
});

function officialMcp(value: string) {
  const u = new URL(value);
  if (u.protocol !== "https:" || u.hostname !== "mcp.appwrite.io") throw new Error("APPWRITE_MCP_URL must be https://mcp.appwrite.io/");
  return u.toString();
}

function restEndpoint(value: string) {
  if (!value) return "";
  const u = new URL(value);
  if (u.protocol !== "https:" && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") throw new Error("APPWRITE_ENDPOINT must use HTTPS except localhost self-hosted development.");
  return u.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = Env.parse(env);
  if (!v.APPWRITE_MCP_ACCESS_TOKEN && !(v.APPWRITE_ENDPOINT && v.APPWRITE_PROJECT_ID && v.APPWRITE_API_KEY)) {
    throw new Error("Configure APPWRITE_MCP_ACCESS_TOKEN or all REST fallback variables: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY.");
  }
  return {
    mcpUrl: officialMcp(v.APPWRITE_MCP_URL),
    mcpAccessToken: v.APPWRITE_MCP_ACCESS_TOKEN,
    endpoint: restEndpoint(v.APPWRITE_ENDPOINT),
    projectId: v.APPWRITE_PROJECT_ID,
    apiKey: v.APPWRITE_API_KEY,
    timeoutMs: v.APPWRITE_TIMEOUT_MS,
    maxRetries: v.APPWRITE_MAX_RETRIES,
    requireWriteApproval: v.APPWRITE_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: v.APPWRITE_ALLOW_DESTRUCTIVE === "true",
    approvedActions: new Set(v.APPWRITE_APPROVED_ACTIONS.split(";").map(x => x.trim()).filter(Boolean))
  };
}

export type Config = ReturnType<typeof loadConfig>;
