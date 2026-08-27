import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ALLOWED = new Set(['query_documents','get_document','get_schema','list_workspace_schemas','list_releases','create_documents','patch_documents','publish_documents','unpublish_documents','discard_drafts']);

export class SanityMcpClient {
  constructor(config, deps = {}) { this.config=config; this.ClientClass=deps.ClientClass||Client; this.TransportClass=deps.TransportClass||StreamableHTTPClientTransport; this.client=null; this.transport=null; this.toolSchemas=null; }
  async connect() {
    if (this.client) return;
    this.transport = new this.TransportClass(new URL(this.config.mcpUrl), { requestInit: { headers: { Authorization: `Bearer ${this.config.token}` } } });
    this.client = new this.ClientClass({ name:'sanity-safe-connector', version:'1.0.0' });
    await this.client.connect(this.transport);
    const listed = await this.client.listTools();
    this.toolSchemas = new Map((listed.tools||[]).filter(t=>ALLOWED.has(t.name)).map(t=>[t.name,t.inputSchema]));
  }
  async call(name,args) {
    if (!ALLOWED.has(name)) throw new Error(`Upstream MCP tool not allowed: ${name}`);
    await this.connect();
    if (!this.toolSchemas.has(name)) throw new Error(`Required Sanity MCP tool is unavailable: ${name}`);
    return this.client.callTool({ name, arguments: args });
  }
  async close(){ await this.transport?.close?.(); this.client=null; this.transport=null; this.toolSchemas=null; }
}
