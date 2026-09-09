import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { ConnectorConfig } from './config.js';

const ALLOWED_UPSTREAM_TOOLS = new Set([
  'search_models',
  'get_model_schema',
  'get_pricing',
  'search_docs',
  'run_model',
  'submit_job',
  'check_job',
  'get_job_result',
  'cancel_job',
  'upload_file',
  'recommend_model'
]);

export class FalOfficialMcpClient {
  private client?: Client;

  constructor(private readonly config: ConnectorConfig) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: 'ai-engineering-fal-ai-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: { Authorization: `Bearer ${this.config.falKey}` }
      }
    });
    await client.connect(transport);
    const listed = await client.listTools();
    const available = new Set(listed.tools.map((tool) => tool.name));
    for (const required of ALLOWED_UPSTREAM_TOOLS) {
      if (!available.has(required)) throw new Error(`UPSTREAM_TOOL_MISSING:${required}`);
    }
    this.client = client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error('UPSTREAM_TOOL_NOT_ALLOWED');
    await this.connect();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.toolTimeoutMs);
    try {
      return await this.client!.callTool({ name, arguments: args }, undefined, {
        signal: controller.signal,
        timeout: this.config.toolTimeoutMs
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
