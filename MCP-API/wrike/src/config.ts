export type Risk = "READ" | "WRITE";

export interface Config {
  mcpUrl: string;
  accessToken: string;
  allowedRisks: Set<Risk>;
  approvalToken?: string;
  timeoutMs: number;
  maxInputBytes: number;
}

const parseIntEnv = (name: string, fallback: number, min: number, max: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
};

export function loadConfig(): Config {
  const mcpUrl = process.env.WRIKE_MCP_URL ?? "https://mcp.wrike.com/v2";
  const url = new URL(mcpUrl);
  if (url.protocol !== "https:") throw new Error("WRIKE_MCP_URL must use HTTPS.");
  if (url.hostname !== "mcp.wrike.com") throw new Error("WRIKE_MCP_URL must point to the official mcp.wrike.com host.");

  const accessToken = process.env.WRIKE_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("WRIKE_ACCESS_TOKEN is required.");

  const rawRisks = (process.env.WRIKE_ALLOWED_RISKS ?? "READ").split(",").map(v => v.trim().toUpperCase()).filter(Boolean);
  const allowedRisks = new Set<Risk>();
  for (const risk of rawRisks) {
    if (risk !== "READ" && risk !== "WRITE") throw new Error(`Unsupported risk permission: ${risk}`);
    allowedRisks.add(risk as Risk);
  }
  if (!allowedRisks.has("READ")) throw new Error("READ permission must remain enabled.");

  return {
    mcpUrl: url.toString(),
    accessToken,
    allowedRisks,
    approvalToken: process.env.WRIKE_APPROVAL_TOKEN?.trim() || undefined,
    timeoutMs: parseIntEnv("WRIKE_TIMEOUT_MS", 20000, 1000, 120000),
    maxInputBytes: parseIntEnv("WRIKE_MAX_INPUT_BYTES", 131072, 1024, 1048576)
  };
}
