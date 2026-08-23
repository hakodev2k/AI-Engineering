import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { XeroConfig } from './config.js';

export interface XeroUpstream {
  call(name: string, args?: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

const SAFE_ENV = ['PATH', 'HOME', 'USERPROFILE', 'TMPDIR', 'TEMP', 'TMP', 'HTTPS_PROXY', 'HTTP_PROXY', 'NO_PROXY', 'NODE_EXTRA_CA_CERTS'] as const;

function childEnv(config: XeroConfig): Record<string, string> {
  const env: Record<string, string> = {};
  for (const key of SAFE_ENV) {
    const value = process.env[key];
    if (value) env[key] = value;
  }
  if (config.bearerToken) env.XERO_CLIENT_BEARER_TOKEN = config.bearerToken;
  if (config.clientId) env.XERO_CLIENT_ID = config.clientId;
  if (config.clientSecret) env.XERO_CLIENT_SECRET = config.clientSecret;
  if (config.scopes) env.XERO_SCOPES = config.scopes;
  return env;
}

export class OfficialXeroMcpUpstream implements XeroUpstream {
  private readonly client = new Client({ name: 'xero-connector-upstream', version: '1.0.0' });
  private connected = false;

  constructor(private readonly config: XeroConfig, private readonly timeoutMs = 30_000) {}

  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@xeroapi/xero-mcp-server@latest'],
      env: childEnv(this.config)
    });
    await this.withTimeout(this.client.connect(transport), 'connect');
    this.connected = true;
  }

  private async withTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`UPSTREAM_TIMEOUT: ${operation} exceeded ${this.timeoutMs}ms`)), this.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    await this.ensureConnected();
    const result = await this.withTimeout(this.client.callTool({ name, arguments: args }), name);
    if (result.isError) {
      throw new Error(`UPSTREAM_MCP_ERROR: ${JSON.stringify(result.content)}`);
    }
    return result;
  }

  async close(): Promise<void> {
    if (!this.connected) return;
    await this.client.close();
    this.connected = false;
  }
}
