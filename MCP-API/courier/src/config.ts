import { z } from "zod";

const EnvSchema = z.object({
  COURIER_API_KEY: z.string().min(1, "COURIER_API_KEY is required"),
  COURIER_MCP_URL: z.string().url().default("https://mcp.courier.com"),
  COURIER_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  COURIER_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  COURIER_TOOL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  COURIER_READ_RETRIES: z.coerce.number().int().min(0).max(3).default(2),
});

export type Config = {
  apiKey: string;
  mcpUrl: string;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
  timeoutMs: number;
  readRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const p = EnvSchema.parse(env);
  const url = new URL(p.COURIER_MCP_URL);
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("COURIER_MCP_URL must use HTTPS except for localhost development.");
  }
  return {
    apiKey: p.COURIER_API_KEY,
    mcpUrl: p.COURIER_MCP_URL,
    allowWrite: p.COURIER_ALLOW_WRITE === "true",
    approvalMode: p.COURIER_APPROVAL_MODE,
    timeoutMs: p.COURIER_TOOL_TIMEOUT_MS,
    readRetries: p.COURIER_READ_RETRIES,
  };
}
