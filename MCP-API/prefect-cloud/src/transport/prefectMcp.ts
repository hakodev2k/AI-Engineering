import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { ConnectorConfig } from "../config.js";
import { CredentialProvider } from "../auth/credentials.js";

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  "get_identity",
  "list_authorized_workspaces",
  "get_dashboard",
  "get_deployments",
  "get_flows",
  "get_flow_runs",
  "get_flow_run_logs",
  "get_task_runs",
  "get_work_pools",
  "read_events",
  "get_automations",
  "review_rate_limits",
]);

export interface PrefectMcpCaller {
  call(tool: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

function normalizeResult(value: unknown, maxBytes: number): unknown {
  const serialized = JSON.stringify(value);
  if (serialized && Buffer.byteLength(serialized, "utf8") > maxBytes) {
    throw new Error("Upstream Prefect MCP response exceeded configured maximum size");
  }
  return value;
}

export class PrefectMcpTransport implements PrefectMcpCaller {
  private readonly credentials: CredentialProvider;
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly config: ConnectorConfig) {
    this.credentials = new CredentialProvider(config);
  }

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const client = new Client({ name: "ai-engineering-prefect-cloud", version: "1.0.0" });
      if (this.config.mcpTransport === "http") {
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: this.credentials.mcpHeaders() },
        });
        await client.connect(transport);
      } else {
        const transport = new StdioClientTransport({
          command: this.config.mcpCommand,
          args: this.config.mcpArgs,
          env: this.credentials.stdioEnv(),
        });
        await client.connect(transport);
      }
      this.client = client;
      return client;
    })();

    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  }

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(tool)) {
      throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);
    }
    const client = await this.connect();
    const result = await client.callTool({ name: tool, arguments: args });
    return normalizeResult(result, this.config.maxResponseBytes);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = undefined;
    }
  }
}
