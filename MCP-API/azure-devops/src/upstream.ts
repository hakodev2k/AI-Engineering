import { createRequire } from 'node:module';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { AzureDevOpsConfig } from './config.js';
import { AzureDevOpsRestClient } from './rest.js';

function cleanEnv(extra: Record<string, string>) {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) if (value !== undefined) env[key] = value;
  return { ...env, ...extra };
}

function unwrap(result: any) {
  if (result?.isError) {
    const message = Array.isArray(result.content) ? result.content.map((x: any) => x?.text ?? '').join('\n') : 'Upstream MCP tool failed';
    throw new Error(message || 'Upstream MCP tool failed');
  }
  if (!Array.isArray(result?.content)) return result;
  const text = result.content.filter((x: any) => x?.type === 'text').map((x: any) => x.text).join('\n');
  if (!text) return result;
  try { return JSON.parse(text); } catch { return { text }; }
}

export class AzureDevOpsUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  private tools?: Set<string>;
  readonly rest: AzureDevOpsRestClient;

  constructor(private readonly config: AzureDevOpsConfig, rest?: AzureDevOpsRestClient) {
    this.rest = rest ?? new AzureDevOpsRestClient(config);
  }

  private async connectMcp() {
    if (!this.config.mcpEnabled) return false;
    if (this.client && this.tools) return true;
    const require = createRequire(import.meta.url);
    const entry = require.resolve('@azure-devops/mcp/dist/index.js');
    const auth = this.config.authMode === 'pat' ? 'pat' : 'envvar';
    const extra: Record<string, string> = {};
    if (this.config.authMode === 'pat') extra.PERSONAL_ACCESS_TOKEN = Buffer.from(`${this.config.patEmail}:${this.config.pat}`).toString('base64');
    else extra.ADO_MCP_AUTH_TOKEN = this.config.bearerToken!;
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [entry, this.config.organization, '--authentication', auth, '-d', 'core', 'work-items', 'repositories', 'pipelines'],
      env: cleanEnv(extra),
      stderr: 'pipe'
    });
    const client = new Client({ name: 'ai-engineering-azure-devops-adapter', version: '1.0.0' });
    await client.connect(transport);
    const listed = await client.listTools();
    this.client = client;
    this.transport = transport;
    this.tools = new Set(listed.tools.map(t => t.name));
    return true;
  }

  private async mcpAvailable(tool: string) {
    try { return (await this.connectMcp()) && !!this.tools?.has(tool); } catch { return false; }
  }

  async read<T>(tool: string, args: Record<string, unknown>, fallback: () => Promise<T>): Promise<unknown> {
    if (await this.mcpAvailable(tool)) {
      try { return unwrap(await this.client!.callTool({ name: tool, arguments: args })); } catch { return fallback(); }
    }
    return fallback();
  }

  async write<T>(tool: string, args: Record<string, unknown>, fallback: () => Promise<T>): Promise<unknown> {
    if (await this.mcpAvailable(tool)) {
      // Never REST-fallback after an attempted write: the MCP call could have committed remotely before a transport failure.
      return unwrap(await this.client!.callTool({ name: tool, arguments: args }));
    }
    return fallback();
  }

  async close() {
    try { await this.client?.close(); } finally { this.client = undefined; this.transport = undefined; this.tools = undefined; }
  }
}
