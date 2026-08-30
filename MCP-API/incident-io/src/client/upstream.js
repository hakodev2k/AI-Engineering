import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export class IncidentIoUpstream {
  constructor(config, { clientFactory, transportFactory } = {}) {
    this.config = config;
    this.clientFactory = clientFactory || (() => new Client({ name: 'incident-io-safe-connector', version: '1.0.0' }, { capabilities: {} }));
    this.transportFactory = transportFactory || ((url, apiKey) => new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: { Authorization: `Bearer ${apiKey}` } }
    }));
    this.client = null;
    this.connecting = null;
  }

  async ensureConnected() {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      const client = this.clientFactory();
      const transport = this.transportFactory(this.config.mcpUrl, this.config.apiKey);
      await client.connect(transport);
      this.client = client;
      return client;
    })();
    try { return await this.connecting; } finally { this.connecting = null; }
  }

  async listTools(signal) {
    const client = await this.ensureConnected();
    return client.listTools(undefined, { signal });
  }

  async callTool(name, args, signal) {
    const client = await this.ensureConnected();
    return client.callTool({ name, arguments: args }, undefined, { signal });
  }

  async close() {
    if (this.client) await this.client.close();
    this.client = null;
  }
}
