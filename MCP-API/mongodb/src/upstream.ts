import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ConnectorConfig } from './config.js';

const SAFE_DISABLED = [
  'delete',
  'drop-index',
  'rename-collection',
  'create-collection',
  'update-many',
  'atlas-create-project',
  'atlas-create-free-cluster',
  'atlas-create-cluster',
  'atlas-upgrade-cluster',
  'atlas-pause-resume-cluster',
  'atlas-create-access-list',
  'atlas-create-db-user',
  'atlas-streams-build',
  'atlas-streams-manage',
  'atlas-streams-teardown'
];

export class MongoUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  private available = new Set<string>();

  constructor(private readonly config: ConnectorConfig) {}

  async connect() {
    const env: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) if (v !== undefined) env[k] = v;
    if (this.config.connectionString) env.MDB_MCP_CONNECTION_STRING = this.config.connectionString;
    if (this.config.atlasClientId) env.MDB_MCP_API_CLIENT_ID = this.config.atlasClientId;
    if (this.config.atlasClientSecret) env.MDB_MCP_API_CLIENT_SECRET = this.config.atlasClientSecret;
    env.MDB_MCP_READ_ONLY = this.config.allowWrites ? 'false' : 'true';
    env.MDB_MCP_DISABLED_TOOLS = SAFE_DISABLED.join(',');
    env.MDB_MCP_DISABLE_SERVER_SIDE_JS = 'true';
    env.MDB_MCP_INDEX_CHECK = String(this.config.indexCheck);
    env.MDB_MCP_MAX_DOCUMENTS_PER_QUERY = String(this.config.maxDocuments);
    env.MDB_MCP_MAX_BYTES_PER_QUERY = String(this.config.maxBytes);
    env.MDB_MCP_MAX_TIME_M_S = String(this.config.maxTimeMS);
    env.MDB_MCP_TELEMETRY = 'disabled';

    this.transport = new StdioClientTransport({ command: 'npx', args: ['-y', 'mongodb-mcp-server@2.0.0'], env });
    this.client = new Client({ name: 'mongodb-safe-wrapper', version: '1.0.0' });
    await this.client.connect(this.transport);
    const list = await this.client.listTools();
    this.available = new Set(list.tools.map(t => t.name));
  }

  has(name: string) { return this.available.has(name); }

  async call(name: string, args: Record<string, unknown>) {
    if (!this.client) throw new Error('MongoDB upstream is not connected');
    if (!this.available.has(name)) throw new Error(`Upstream MongoDB MCP tool is unavailable: ${name}`);
    return this.client.callTool({ name, arguments: args });
  }

  async close() {
    await this.client?.close();
  }
}
