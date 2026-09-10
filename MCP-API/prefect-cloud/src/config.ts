import { z } from "zod";

const EnvSchema = z.object({
  PREFECT_API_URL: z.string().url().optional(),
  PREFECT_API_KEY: z.string().min(1).optional(),
  PREFECT_API_VERSION: z.string().min(1).optional(),
  PREFECT_MCP_TRANSPORT: z.enum(["http", "stdio"]).default("http"),
  PREFECT_MCP_URL: z.string().url().default("https://prefect.fastmcp.app/mcp"),
  PREFECT_MCP_ACCESS_TOKEN: z.string().min(1).optional(),
  PREFECT_MCP_COMMAND: z.string().min(1).default("uvx"),
  PREFECT_MCP_ARGS: z.string().default("--from,prefect-mcp,prefect-mcp-server"),
  PREFECT_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  PREFECT_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  PREFECT_MAX_RESPONSE_BYTES: z.coerce.number().int().min(1024).max(10_485_760).default(2_097_152),
  PREFECT_ENABLE_EXECUTION: z.enum(["true", "false"]).default("false"),
  PREFECT_APPROVAL_TOKEN: z.string().min(16).optional(),
});

export type ConnectorConfig = {
  apiUrl?: string;
  apiKey?: string;
  apiVersion?: string;
  mcpTransport: "http" | "stdio";
  mcpUrl: string;
  mcpAccessToken?: string;
  mcpCommand: string;
  mcpArgs: string[];
  requestTimeoutMs: number;
  maxRetries: number;
  maxResponseBytes: number;
  enableExecution: boolean;
  approvalToken?: string;
};

function validateApiUrl(value?: string): string | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !local) {
    throw new Error("PREFECT_API_URL must use HTTPS unless it targets localhost");
  }
  return value.replace(/\/+$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const parsed = EnvSchema.parse(env);
  return {
    apiUrl: validateApiUrl(parsed.PREFECT_API_URL),
    apiKey: parsed.PREFECT_API_KEY,
    apiVersion: parsed.PREFECT_API_VERSION,
    mcpTransport: parsed.PREFECT_MCP_TRANSPORT,
    mcpUrl: parsed.PREFECT_MCP_URL,
    mcpAccessToken: parsed.PREFECT_MCP_ACCESS_TOKEN,
    mcpCommand: parsed.PREFECT_MCP_COMMAND,
    mcpArgs: parsed.PREFECT_MCP_ARGS.split(",").map((x) => x.trim()).filter(Boolean),
    requestTimeoutMs: parsed.PREFECT_REQUEST_TIMEOUT_MS,
    maxRetries: parsed.PREFECT_MAX_RETRIES,
    maxResponseBytes: parsed.PREFECT_MAX_RESPONSE_BYTES,
    enableExecution: parsed.PREFECT_ENABLE_EXECUTION === "true",
    approvalToken: parsed.PREFECT_APPROVAL_TOKEN,
  };
}
