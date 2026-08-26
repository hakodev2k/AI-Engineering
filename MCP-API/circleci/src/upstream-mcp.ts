import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const ALLOWLIST = new Set([
  'hello',
  'list_runs',
  'get_run',
  'list_workflows',
  'get_workflow',
  'rerun_workflow',
  'cancel_workflow',
  'list_jobs',
  'get_job',
  'get_job_logs',
  'list_artifacts',
  'list_job_tests',
  'download_usage_data'
]);

const ALIASES: Record<string, string[]> = {
  project: ['project', 'project_slug', 'project_id', 'slug'],
  branch: ['branch'],
  status: ['status', 'run_status'],
  runId: ['run_id', 'run_uuid', 'id', 'uuid'],
  workflowId: ['workflow_id', 'workflow_uuid', 'id', 'uuid'],
  jobId: ['job_id', 'job_uuid', 'id', 'uuid'],
  fromFailed: ['from_failed', 'fromFailed'],
  step: ['step', 'step_name'],
  all: ['all', 'include_all'],
  org: ['org', 'organization', 'org_slug', 'org_id'],
  startDate: ['start_date', 'startDate', 'from'],
  endDate: ['end_date', 'endDate', 'to']
};

export class CircleCiMcpClient {
  private client?: Client;
  private toolSchemas = new Map<string, Set<string>>();

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: { Authorization: `Bearer ${this.config.mcpBearerToken}` }
      }
    });
    const client = new Client({ name: 'ai-engineering-circleci-connector', version: '1.0.0' });
    await client.connect(transport);
    const listed = await client.listTools();
    for (const tool of listed.tools) {
      if (!ALLOWLIST.has(tool.name)) continue;
      const properties = (tool.inputSchema && typeof tool.inputSchema === 'object' && 'properties' in tool.inputSchema)
        ? Object.keys((tool.inputSchema as { properties?: Record<string, unknown> }).properties ?? {})
        : [];
      this.toolSchemas.set(tool.name, new Set(properties));
    }
    this.client = client;
  }

  async call(toolName: string, semanticArgs: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWLIST.has(toolName)) throw new Error(`Upstream MCP tool is not allowlisted: ${toolName}`);
    await this.connect();
    if (!this.client) throw new Error('CircleCI MCP client failed to initialize');
    if (!this.toolSchemas.has(toolName)) throw new Error(`CircleCI hosted MCP does not expose expected tool: ${toolName}`);

    const args = this.mapArguments(toolName, semanticArgs);
    const result = await this.client.callTool({ name: toolName, arguments: args });
    if (result.isError) throw new Error(`CircleCI MCP tool ${toolName} returned an error`);
    return result;
  }

  private mapArguments(toolName: string, semanticArgs: Record<string, unknown>): Record<string, unknown> {
    const accepted = this.toolSchemas.get(toolName) ?? new Set<string>();
    const mapped: Record<string, unknown> = {};
    for (const [semanticKey, value] of Object.entries(semanticArgs)) {
      if (value === undefined) continue;
      const candidates = ALIASES[semanticKey] ?? [semanticKey];
      const target = candidates.find((candidate) => accepted.has(candidate));
      if (target) mapped[target] = value;
      else if (accepted.has(semanticKey)) mapped[semanticKey] = value;
      else throw new Error(`CircleCI MCP tool ${toolName} does not expose a compatible argument for ${semanticKey}`);
    }
    return mapped;
  }
}
