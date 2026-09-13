export interface Config {
  token: string;
  mcpUrl: string;
  allowWrites: boolean;
  allowHighRisk: boolean;
  timeoutMs: number;
}

function bool(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0 || value > 120000) {
    throw new Error(`${name} must be an integer between 1 and 120000`);
  }
  return value;
}

export function loadConfig(env = process.env): Config {
  const token = env.VAPI_TOKEN?.trim();
  if (!token) throw new Error("VAPI_TOKEN is required");

  const mcpUrl = (env.VAPI_MCP_URL ?? "https://mcp.vapi.ai/mcp").trim();
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== "https:") throw new Error("VAPI_MCP_URL must use https");
  if (parsed.hostname !== "mcp.vapi.ai") throw new Error("VAPI_MCP_URL host must be mcp.vapi.ai");

  const previous = process.env;
  try {
    process.env = env;
    return {
      token,
      mcpUrl,
      allowWrites: bool("VAPI_ALLOW_WRITES", false),
      allowHighRisk: bool("VAPI_ALLOW_HIGH_RISK", false),
      timeoutMs: positiveInt("VAPI_TIMEOUT_MS", 20000)
    };
  } finally {
    process.env = previous;
  }
}
