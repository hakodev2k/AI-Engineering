import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { DopplerConfig } from './config.js';

export class DopplerMcpClient {
  private client?: Client;
  private transport?: StdioClientTransport;
  private connecting?: Promise<void>;

  constructor(private readonly cfg: DopplerConfig) {}

  private async ensureConnected() {
    if (!this.cfg.useUpstreamMcp) throw new Error('Official Doppler MCP disabled');
    if (this.client) return;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      const args = ['-y', '@dopplerhq/mcp-server'];
      if (this.cfg.readOnly) args.push('--read-only');
      if (this.cfg.project) args.push('--project', this.cfg.project);
      if (this.cfg.config) args.push('--config', this.cfg.config);
      const transport = new StdioClientTransport({
        command: 'npx',
        args,
        env: { ...process.env, DOPPLER_TOKEN: this.cfg.token } as Record<string, string>
      });
      const client = new Client({ name: 'doppler-wrapper-client', version: '1.0.0' });
      await client.connect(transport);
      this.transport = transport;
      this.client = client;
    })();
    try { await this.connecting; } finally { this.connecting = undefined; }
  }

  async tryCall(tool: string, args: Record<string, unknown>): Promise<unknown | undefined> {
    if (!this.cfg.useUpstreamMcp) return undefined;
    try {
      await this.ensureConnected();
      const tools = await this.client!.listTools();
      if (!tools.tools.some(t => t.name === tool)) return undefined;
      const result = await this.client!.callTool({ name: tool, arguments: args });
      if (result.isError) throw new Error(`Doppler MCP tool failed: ${tool}`);
      return result;
    } catch {
      return undefined;
    }
  }

  async close() {
    try { await this.client?.close(); } finally { this.client = undefined; this.transport = undefined; }
  }
}
