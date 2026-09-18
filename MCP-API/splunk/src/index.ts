import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { z } from 'zod';

export const UPSTREAM = new Set([
  'splunk_get_info','splunk_get_user_info','splunk_get_indexes','splunk_get_index_info',
  'splunk_get_metadata','splunk_get_knowledge_objects','splunk_list_alerts','splunk_get_alert_details',
  'splunk_run_query','splunk_run_saved_search'
]);

export function assertSafeQuery(query: string): void {
  if (!query.trim() || query.length > 20000) throw new Error('query must be 1..20000 characters');
  const risky = /(?:^|\|)\s*(?:delete|collect|outputlookup|sendemail|script|runshellscript)\b/i;
  if (risky.test(query)) throw new Error('Query contains a state-changing or external-side-effect SPL command');
}

export function requireSavedSearchApproval(): void {
  if (process.env.SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH !== 'true')
    throw new Error('HIGH_RISK approval required: operator must set SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH=true');
}

class SplunkUpstream {
  private client?: Client;
  async connect(): Promise<Client> {
    if (this.client) return this.client;
    const endpoint = process.env.SPLUNK_MCP_URL;
    const token = process.env.SPLUNK_MCP_TOKEN;
    if (!endpoint || !token) throw new Error('SPLUNK_MCP_URL and SPLUNK_MCP_TOKEN are required');
    const url = new URL(endpoint);
    if (url.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(url.hostname)) throw new Error('Remote MCP endpoint must use HTTPS');
    const transport = new StreamableHTTPClientTransport(url, {requestInit:{headers:{Authorization:`Bearer ${token}`}}});
    const client = new Client({name:'splunk-safe-connector',version:'1.0.0'});
    await client.connect(transport);
    const listed = await client.listTools();
    const names = new Set(listed.tools.map(t=>t.name));
    for (const name of UPSTREAM) if (!names.has(name) && name !== 'splunk_run_saved_search') console.error(`Splunk upstream tool unavailable: ${name}`);
    this.client = client;
    return client;
  }
  async call(name:string,args:Record<string,unknown>={}):Promise<unknown>{
    if(!UPSTREAM.has(name)) throw new Error(`Upstream tool not allowlisted: ${name}`);
    const client=await this.connect();
    const timeout=Number(process.env.SPLUNK_TIMEOUT_MS ?? '60000');
    return await Promise.race([
      client.callTool({name,arguments:args}),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('Splunk MCP timeout')),Math.max(1000,Math.min(timeout,120000))))
    ]);
  }
}

export function createServer(upstream = new SplunkUpstream()): McpServer {
  const s=new McpServer({name:'splunk-connector',version:'1.0.0'});
  const out=(v:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(v)}]});
  s.tool('splunk.instance.get','READ: Get Splunk instance/version/status information.',{},async()=>out(await upstream.call('splunk_get_info')));
  s.tool('splunk.user.current','READ: Get current authenticated user roles and permissions.',{},async()=>out(await upstream.call('splunk_get_user_info')));
  s.tool('splunk.index.list','READ: List accessible indexes.',{},async()=>out(await upstream.call('splunk_get_indexes')));
  s.tool('splunk.index.get','READ: Get one index configuration/status.',{index:z.string().min(1).max(256)},async a=>out(await upstream.call('splunk_get_index_info',a)));
  s.tool('splunk.metadata.get','READ: Retrieve host/source/sourcetype metadata.',{indexes:z.array(z.string().min(1)).min(1).max(20),type:z.enum(['hosts','sources','sourcetypes']),earliest:z.string().max(64).optional(),latest:z.string().max(64).optional()},async a=>out(await upstream.call('splunk_get_metadata',a)));
  s.tool('splunk.knowledge_object.list','READ: List knowledge objects of a supported type.',{type:z.enum(['saved_searches','alerts','field_extractions','field_aliases','calculated_fields','lookups','automatic_lookups','lookup_transforms','macros','tags','data_models','workflow_actions','views','panels','apps','mltk_models','mltk_algorithms'])},async a=>out(await upstream.call('splunk_get_knowledge_objects',a)));
  s.tool('splunk.alert.list','READ: List accessible alerts.',{app:z.string().max(256).optional(),enabled:z.boolean().optional(),severity:z.string().max(64).optional()},async a=>out(await upstream.call('splunk_list_alerts',a)));
  s.tool('splunk.alert.get','READ: Get alert configuration/details.',{name:z.string().min(1).max(512),app:z.string().max(256).optional()},async a=>out(await upstream.call('splunk_get_alert_details',a)));
  s.tool('splunk.search.run','READ: Run bounded, non-destructive SPL/SPL2 through official Splunk MCP guardrails.',{query:z.string().min(1).max(20000),workload_pool:z.string().max(256).optional()},async a=>{assertSafeQuery(a.query);return out(await upstream.call('splunk_run_query',a));});
  s.tool('splunk.saved_search.run','HIGH_RISK: Run an existing saved search; operator approval gate is required because saved searches can have actions.',{name:z.string().min(1).max(512),app:z.string().max(256).optional()},async a=>{requireSavedSearchApproval();return out(await upstream.call('splunk_run_saved_search',a));});
  return s;
}

if(process.env.NODE_ENV!=='test'){
  const server=createServer();
  await server.connect(new StdioServerTransport());
}
