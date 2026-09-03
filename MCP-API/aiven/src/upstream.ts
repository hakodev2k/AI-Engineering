import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Config } from "./config.js";

export interface UpstreamClient {
  listTools(): Promise<{ tools: Array<{ name: string; description?: string; inputSchema: Record<string, unknown> }> }>;
  callTool(request: { name: string; arguments?: Record<string, unknown> }): Promise<unknown>;
  close(): Promise<void>;
}

function safeChildEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") env[key] = value;
  }
  return env;
}

export async function createOfficialAivenClient(config: Config): Promise<UpstreamClient> {
  const transport = new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["--no-install", "mcp-aiven"],
    env: {
      ...safeChildEnv(),
      AIVEN_TOKEN: config.token,
      AIVEN_READ_ONLY: config.readOnly ? "true" : "false",
      AIVEN_ALLOW_SECRETS: "false",
    },
    stderr: "pipe",
  });

  const client = new Client({ name: "ai-engineering-aiven-connector", version: "1.0.0" });
  await client.connect(transport);

  return {
    listTools: () => client.listTools() as Promise<{ tools: Array<{ name: string; description?: string; inputSchema: Record<string, unknown> }> }>,
    callTool: (request) => client.callTool(request),
    close: () => client.close(),
  };
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Upstream Aiven MCP call timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
