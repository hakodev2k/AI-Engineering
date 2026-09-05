import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export type DiscoveredTool = {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
};

export interface UpstreamClient {
  listTools(): Promise<{ tools: DiscoveredTool[] }>;
  callTool(request: { name: string; arguments?: Record<string, unknown> }): Promise<unknown>;
  close(): Promise<void>;
}

export async function createOfficialCourierClient(config: Config): Promise<UpstreamClient> {
  const transport = new StreamableHTTPClientTransport(new URL(config.mcpUrl), {
    requestInit: {
      headers: {
        api_key: config.apiKey,
      },
    },
  });
  const client = new Client({ name: "ai-engineering-courier-connector", version: "1.0.0" });
  await client.connect(transport);
  return {
    listTools: () => client.listTools() as Promise<{ tools: DiscoveredTool[] }>,
    callTool: (request) => client.callTool(request),
    close: () => client.close(),
  };
}
