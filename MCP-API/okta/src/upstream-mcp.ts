import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import type { OktaConfig } from './config.js';

export class OktaUpstreamMcp {
  private client?: Client;
  private transport?: StdioClientTransport;
  private availableTools = new Set<string>();

  constructor(private readonly config: OktaConfig) {}

  async connect(): Promise<void> {
    if (!this.config.mcpEnabled || this.client) return;
    const env: Record<string, string> = {
      ...(Object.fromEntries(Object.entries(process.env).filter(([, value]) => typeof value === 'string')) as Record<string, string>),
      OKTA_ORG_URL: this.config.orgUrl,
      ...(this.config.mcpClientId ? { OKTA_CLIENT_ID: this.config.mcpClientId } : {}),
      ...(this.config.mcpScopes ? { OKTA_SCOPES: this.config.mcpScopes } : {}),
      ...(this.config.mcpPrivateKey ? { OKTA_PRIVATE_KEY: this.config.mcpPrivateKey } : {}),
      ...(this.config.mcpKeyId ? { OKTA_KEY_ID: this.config.mcpKeyId } : {})
    };
    this.transport = new StdioClientTransport({
      command: this.config.mcpCommand,
      args: this.config.mcpArgs,
      cwd: this.config.mcpDirectory,
      env,
      maxBufferSize: 10 * 1024 * 1024
    });
    this.client = new Client({ name: 'ai-engineering-okta-router', version: '1.0.0' }, { versionNegotiation: { mode: 'auto' } });
    await this.client.connect(this.transport);
    const listed = await this.client.listTools();
    this.availableTools = new Set(listed.tools.map((tool) => tool.name));
  }

  hasTool(name: string): boolean { return this.availableTools.has(name); }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.client) await this.connect();
    if (!this.client || !this.hasTool(name)) throw new Error(`Official Okta MCP tool unavailable: ${name}`);
    const result = await this.client.callTool({ name, arguments: args });
    if ('structuredContent' in result && result.structuredContent !== undefined) return result.structuredContent;
    const text = result.content?.find((item) => item.type === 'text');
    if (text && text.type === 'text') {
      try { return JSON.parse(text.text) as unknown; } catch { return { text: text.text }; }
    }
    return result.content ?? [];
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
    this.availableTools.clear();
  }
}
