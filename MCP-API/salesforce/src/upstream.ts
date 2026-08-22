import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export type UpstreamKind = 'read' | 'mutation' | 'delete';

export const TOOL_ALIASES = {
  schema: ['getObjectSchema', 'get_object_schema'],
  query: ['soqlQuery', 'soql_query'],
  search: ['find', 'soslSearch', 'sosl_search'],
  user: ['getCurrentUser', 'get_current_user'],
  recent: ['recentlyViewed', 'recently_viewed'],
  relatedList: ['getRelatedRecords', 'get_related_records'],
  create: ['createSobjectRecord', 'create_sobject_record'],
  update: ['updateSobjectRecord', 'update_sobject_record'],
  relatedUpdate: ['updateRelatedRecord', 'update_related_record'],
  delete: ['deleteSobjectRecord', 'delete_sobject_record'],
  relatedDelete: ['deleteRelatedRecord', 'delete_related_record']
} as const;

export class SalesforceUpstream {
  private readonly clients = new Map<UpstreamKind, Client>();
  constructor(private readonly config: Config) {}

  private urlFor(kind: UpstreamKind) {
    return kind === 'read' ? this.config.readUrl : kind === 'mutation' ? this.config.mutationUrl : this.config.deleteUrl;
  }

  async client(kind: UpstreamKind): Promise<Client> {
    const existing = this.clients.get(kind);
    if (existing) return existing;
    const client = new Client({ name: `salesforce-${kind}-gateway`, version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.urlFor(kind)), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
    });
    await client.connect(transport);
    this.clients.set(kind, client);
    return client;
  }

  async call(kind: UpstreamKind, aliases: readonly string[], args: Record<string, unknown>) {
    const client = await this.client(kind);
    const tools = await client.listTools();
    const allowed = new Set(aliases);
    const match = tools.tools.find(t => allowed.has(t.name));
    if (!match) throw new Error(`UPSTREAM_TOOL_UNAVAILABLE: expected one of ${aliases.join(', ')}`);
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('UPSTREAM_TIMEOUT')), this.config.timeoutMs));
    return await Promise.race([client.callTool({ name: match.name, arguments: args }), timeout]);
  }

  async close() {
    await Promise.all([...this.clients.values()].map(c => c.close().catch(() => undefined)));
    this.clients.clear();
  }
}
