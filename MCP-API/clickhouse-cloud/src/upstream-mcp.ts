import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport, type StdioServerParameters } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Config } from "./config.js";

export interface QueryMcpClient {
  listTools(): Promise<{ tools: Array<{ name: string; inputSchema: Record<string, unknown>; description?: string }> }>;
  callTool(req: { name: string; arguments?: Record<string, unknown> }): Promise<unknown>;
  close(): Promise<void>;
}

export async function createOfficialClickHouseMcp(cfg: Config): Promise<QueryMcpClient> {
  const env: Record<string, string> = {
    CLICKHOUSE_HOST: cfg.host,
    CLICKHOUSE_PORT: String(cfg.port),
    CLICKHOUSE_USER: cfg.user,
    CLICKHOUSE_PASSWORD: cfg.password,
    CLICKHOUSE_SECURE: String(cfg.secure),
    CLICKHOUSE_VERIFY: String(cfg.verify),
    CLICKHOUSE_DATABASE: cfg.database,
    CLICKHOUSE_ALLOW_WRITE_ACCESS: "false"
  };
  if (cfg.role) env.CLICKHOUSE_ROLE = cfg.role;

  const params: StdioServerParameters = {
    command: "uv",
    args: ["run", "--with", "mcp-clickhouse", "--python", "3.10", "mcp-clickhouse"],
    env: { ...process.env, ...env },
    stderr: "pipe"
  };
  const transport = new StdioClientTransport(params);
  const client = new Client({ name: "clickhouse-cloud-safe-connector", version: "1.0.0" });
  await client.connect(transport);
  return {
    listTools: () => client.listTools() as Promise<{ tools: Array<{ name: string; inputSchema: Record<string, unknown>; description?: string }> }>,
    callTool: (req) => client.callTool(req),
    close: () => client.close()
  };
}

export async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([p, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error(`MCP call timed out after ${ms}ms`)), ms); })]);
  } finally { if (timer) clearTimeout(timer); }
}
