export interface Config {
  apiKey: string;
  mcpUrl: string;
  personaVersion: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

function bool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return /^(1|true|yes)$/i.test(value);
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.PERSONA_API_KEY?.trim();
  if (!apiKey) throw new Error("PERSONA_API_KEY is required");
  const mcpUrl = process.env.PERSONA_MCP_URL?.trim() || "https://mcp.withpersona.com";
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "mcp.withpersona.com") {
    throw new Error("PERSONA_MCP_URL must use the official https://mcp.withpersona.com endpoint");
  }
  const personaVersion = process.env.PERSONA_VERSION?.trim() || "2025-12-08";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(personaVersion)) throw new Error("PERSONA_VERSION must be YYYY-MM-DD");
  return {
    apiKey,
    mcpUrl,
    personaVersion,
    timeoutMs: integer("PERSONA_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: integer("PERSONA_MAX_RETRIES", 3, 0, 5),
    allowWrites: bool("PERSONA_ALLOW_WRITES"),
    allowHighRisk: bool("PERSONA_ALLOW_HIGH_RISK")
  };
}
