import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Config } from './config.js';
import { SigNozMcpClient, TOOL_MAP } from './upstream.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';
export type ToolPolicy = { risk: Risk; approvalRequired: boolean };

export const POLICIES: Record<keyof typeof TOOL_MAP, ToolPolicy> = {
  'signoz.org.overview': { risk: 'READ', approvalRequired: false },
  'signoz.metric.list': { risk: 'READ', approvalRequired: false },
  'signoz.metric.query': { risk: 'READ', approvalRequired: false },
  'signoz.service.list': { risk: 'READ', approvalRequired: false },
  'signoz.alert.list': { risk: 'READ', approvalRequired: false },
  'signoz.alert.get': { risk: 'READ', approvalRequired: false },
  'signoz.alert.create': { risk: 'WRITE', approvalRequired: true },
  'signoz.alert.update': { risk: 'WRITE', approvalRequired: true },
  'signoz.alert.delete': { risk: 'DESTRUCTIVE', approvalRequired: true },
  'signoz.dashboard.list': { risk: 'READ', approvalRequired: false },
  'signoz.dashboard.get': { risk: 'READ', approvalRequired: false },
  'signoz.log.search': { risk: 'READ', approvalRequired: false },
  'signoz.trace.search': { risk: 'READ', approvalRequired: false },
  'signoz.trace.get': { risk: 'READ', approvalRequired: false }
};

const ArgsSchema = z.record(z.unknown()).default({});
const ApprovalSchema = z.object({
  arguments: ArgsSchema,
  approved: z.literal(true),
  approvalReason: z.string().trim().min(3).max(500)
});

export function enforcePolicy(name: keyof typeof TOOL_MAP, config: Config, approved = false): void {
  const policy = POLICIES[name];
  if (policy.risk === 'WRITE' && (!config.allowWrite || !approved)) throw new Error(`${name} requires write enablement and explicit approval`);
  if (policy.risk === 'DESTRUCTIVE' && (!config.allowDestructive || !approved)) throw new Error(`${name} is destructive and disabled without explicit destructive enablement and approval`);
}

const textResult = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });

export function registerTools(server: McpServer, upstream: SigNozMcpClient, config: Config): void {
  const readTools = [
    ['signoz.org.overview', 'Get SigNoz organization/deployment overview.'],
    ['signoz.metric.list', 'List active metrics and metadata.'],
    ['signoz.metric.query', 'Query metric values, trends, breakdowns, or formulas.'],
    ['signoz.service.list', 'List APM services with trace activity.'],
    ['signoz.alert.list', 'List configured alert rules.'],
    ['signoz.alert.get', 'Get one alert rule definition.'],
    ['signoz.dashboard.list', 'List dashboard summaries.'],
    ['signoz.dashboard.get', 'Get a complete dashboard configuration.'],
    ['signoz.log.search', 'Search logs with filters and pagination.'],
    ['signoz.trace.search', 'Search traces with filters.'],
    ['signoz.trace.get', 'Get full trace details including spans.']
  ] as const;

  for (const [name, description] of readTools) {
    server.registerTool(name, { description, inputSchema: { arguments: ArgsSchema } }, async ({ arguments: args }) => {
      enforcePolicy(name, config);
      return textResult(await upstream.call(TOOL_MAP[name], args));
    });
  }

  const writeTools = [
    ['signoz.alert.create', 'Create an alert rule using SigNoz validation.'],
    ['signoz.alert.update', 'Update an existing alert rule.']
  ] as const;
  for (const [name, description] of writeTools) {
    server.registerTool(name, { description, inputSchema: ApprovalSchema.shape }, async (input) => {
      enforcePolicy(name, config, input.approved);
      return textResult(await upstream.call(TOOL_MAP[name], input.arguments));
    });
  }

  server.registerTool('signoz.alert.delete', {
    description: 'Delete an alert rule. Destructive and disabled by default.',
    inputSchema: ApprovalSchema.shape
  }, async (input) => {
    enforcePolicy('signoz.alert.delete', config, input.approved);
    return textResult(await upstream.call(TOOL_MAP['signoz.alert.delete'], input.arguments));
  });
}
