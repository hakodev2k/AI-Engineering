import type { Risk } from './policy.js';
import type { UpstreamTool } from './upstream.js';

export interface ToolRoute {
  external: string;
  upstream: string;
  risk: Risk;
  purpose: string;
}

export interface ResolvedTool extends ToolRoute {
  inputSchema: Record<string, unknown>;
}

export const TOOL_ROUTES: readonly ToolRoute[] = [
  { external: 'flagsmith.organization.list', upstream: 'list_organizations', risk: 'READ', purpose: 'List accessible Flagsmith organisations.' },
  { external: 'flagsmith.project.list', upstream: 'list_projects_in_organization', risk: 'READ', purpose: 'List projects in an organisation.' },
  { external: 'flagsmith.project.get', upstream: 'get_project', risk: 'READ', purpose: 'Get project configuration and metadata.' },
  { external: 'flagsmith.environment.list', upstream: 'list_project_environments', risk: 'READ', purpose: 'List environments in a project.' },
  { external: 'flagsmith.feature.list', upstream: 'list_project_features', risk: 'READ', purpose: 'List project feature flags, optionally including live environment state when supported upstream.' },
  { external: 'flagsmith.feature.get', upstream: 'get_feature_flag', risk: 'READ', purpose: 'Read detailed feature-flag metadata.' },
  { external: 'flagsmith.feature.code_references.get', upstream: 'get_feature_code_references', risk: 'READ', purpose: 'Read code references and usage information for a feature flag.' },
  { external: 'flagsmith.multivariate_option.list', upstream: 'list_feature_multivariate_options', risk: 'READ', purpose: 'List multivariate options for a feature flag.' },
  { external: 'flagsmith.segment.list', upstream: 'list_project_segments', risk: 'READ', purpose: 'List targeting segments in a project.' },
  { external: 'flagsmith.segment.get', upstream: 'get_project_segment', risk: 'READ', purpose: 'Read a targeting segment and its rules.' },
  { external: 'flagsmith.feature.create', upstream: 'create_feature', risk: 'WRITE', purpose: 'Create a feature flag using the official Flagsmith MCP operation.' },
  { external: 'flagsmith.feature.update', upstream: 'update_feature', risk: 'WRITE', purpose: 'Update feature-flag metadata.' },
  { external: 'flagsmith.segment.create', upstream: 'create_project_segment', risk: 'WRITE', purpose: 'Create a project targeting segment.' },
  { external: 'flagsmith.segment.update', upstream: 'update_project_segment', risk: 'WRITE', purpose: 'Update a project targeting segment and its rules.' },
  { external: 'flagsmith.feature_state.update', upstream: 'update_feature_state', risk: 'HIGH_RISK', purpose: 'Change a feature state, including enabled status or value; this can alter live application behaviour.' },
  { external: 'flagsmith.feature_version.publish', upstream: 'publish_environment_feature_version', risk: 'HIGH_RISK', purpose: 'Publish a v2 feature version to make it live in an environment.' },
] as const;

function withApproval(schema: Record<string, unknown>, risk: Risk): Record<string, unknown> {
  if (risk === 'READ') return structuredClone(schema);
  const result = structuredClone(schema);
  const properties = typeof result.properties === 'object' && result.properties !== null
    ? result.properties as Record<string, unknown>
    : {};
  result.properties = {
    ...properties,
    approved: {
      type: 'boolean',
      description: risk === 'HIGH_RISK'
        ? 'Must be true after explicit human approval for this high-risk operation.'
        : 'Set true after human approval when write approval is required by connector policy.',
    },
  };
  return result;
}

export function resolveTools(upstreamTools: UpstreamTool[]): ResolvedTool[] {
  const byName = new Map(upstreamTools.map(tool => [tool.name, tool]));
  return TOOL_ROUTES.map(route => {
    const upstream = byName.get(route.upstream);
    if (!upstream) throw new Error(`Official Flagsmith MCP server is missing required allowlisted tool: ${route.upstream}`);
    if (!upstream.inputSchema || upstream.inputSchema.type !== 'object') {
      throw new Error(`Invalid input schema returned for official Flagsmith tool: ${route.upstream}`);
    }
    return { ...route, inputSchema: withApproval(upstream.inputSchema, route.risk) };
  });
}

export function stripLocalApproval(args: Record<string, unknown>): { approved?: boolean; upstreamArgs: Record<string, unknown> } {
  const { approved, ...upstreamArgs } = args;
  return { approved: typeof approved === 'boolean' ? approved : undefined, upstreamArgs };
}
