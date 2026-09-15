import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class SocketUpstream {
  constructor(env = process.env) { this.env = env; this.client = null; this.transport = null; }
  async connect() {
    if (this.client) return;
    const command = this.env.SOCKET_UPSTREAM_COMMAND || 'npx';
    const args = command === 'npx' ? ['-y', '@socketsecurity/mcp@latest'] : [];
    this.transport = new StdioClientTransport({ command, args, env: { ...process.env, ...(this.env.SOCKET_API_TOKEN ? { SOCKET_API_TOKEN: this.env.SOCKET_API_TOKEN } : {}) } });
    this.client = new Client({ name: 'ai-engineering-socket-connector', version: '1.0.0' });
    await this.client.connect(this.transport);
    const advertised = await this.client.listTools();
    this.upstreamNames = new Set(advertised.tools.map(t => t.name));
  }
  async call(name, args) {
    await this.connect();
    if (!this.upstreamNames.has(name)) throw new Error(`Official Socket MCP did not advertise expected tool: ${name}`);
    const timeout = Number(this.env.SOCKET_UPSTREAM_TIMEOUT_MS || 30000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try { return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal }); }
    finally { clearTimeout(timer); }
  }
  async close() { if (this.client) await this.client.close(); this.client = null; }
}
