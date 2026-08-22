import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

const ALLOWED = new Set([
  'search_dashboards', 'get_dashboard_by_uid', 'get_dashboard_summary',
  'get_dashboard_panel_queries', 'list_datasources', 'get_datasource',
  'update_dashboard', 'create_folder', 'search_folders'
]);

function cleanEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

export class GrafanaUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  constructor(private readonly config: Config) {}

  async connect() {
    if (this.client) return;
    this.transport = new StdioClientTransport({
      command: this.config.mcpCommand,
      args: this.config.mcpArgs,
      env: {
        ...cleanEnv(process.env),
        GRAFANA_URL: this.config.url,
        GRAFANA_SERVICE_ACCOUNT_TOKEN: this.config.token,
        ...(this.config.orgId ? { GRAFANA_ORG_ID: this.config.orgId } : {})
      }
    });
    this.client = new Client({ name: 'ai-engineering-grafana-wrapper', version: '1.0.0' });
    await this.client.connect(this.transport);
  }

  async status() {
    await this.connect();
    const tools = await this.client!.listTools();
    const available = tools.tools.map(t => t.name).filter(name => ALLOWED.has(name));
    return { connected: true, availableAllowedTools: available, missingAllowedTools: [...ALLOWED].filter(x => !available.includes(x)) };
  }

  async call(name: string, args: Record<string, unknown>) {
    if (!ALLOWED.has(name)) throw new Error(`UPSTREAM_TOOL_DENIED: ${name}`);
    await this.connect();
    const result = await this.client!.callTool({ name, arguments: args });
    if (result.isError) throw new Error(`UPSTREAM_MCP_ERROR: ${JSON.stringify(result.content)}`);
    return result.content;
  }

  async close() {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}

export async function grafanaHealth(config: Config, fetchImpl: typeof fetch = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetchImpl(`${config.url}/api/health`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/json',
        ...(config.orgId ? { 'X-Grafana-Org-Id': config.orgId } : {})
      }
    });
    const text = await response.text();
    let data: unknown = {};
    if (text) {
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
    }
    if (!response.ok) throw new Error(`GRAFANA_HTTP_${response.status}: ${JSON.stringify(data)}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}
