import { z } from "zod";
import type { ConnectorConfig } from "../config.js";
import type { PrefectMcpCaller } from "../transport/prefectMcp.js";
import { PrefectApiClient } from "../client/prefectApi.js";
import { requireApproval, requireExecutionEnabled } from "../models/policy.js";

const Workspace = z.string().uuid().optional();
const Filter = z.record(z.string(), z.unknown()).refine(
  (value) => JSON.stringify(value).length <= 10_000,
  "filter is too large",
).optional();
const Offset = z.number().int().min(0).max(100_000).default(0);

export const schemas = {
  identity: z.object({ workspace_id: Workspace }).strict(),
  dashboard: z.object({ workspace_id: Workspace }).strict(),
  list200: z.object({ workspace_id: Workspace, filter: Filter, limit: z.number().int().min(1).max(200).default(50), offset: Offset }).strict(),
  logs: z.object({ workspace_id: Workspace, flow_run_id: z.string().uuid(), limit: z.number().int().min(1).max(1000).default(100) }).strict(),
  events: z.object({
    workspace_id: Workspace,
    event_type_prefix: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/).optional(),
    limit: z.number().int().min(1).max(500).default(50),
    occurred_after: z.string().datetime({ offset: true }).optional(),
    occurred_before: z.string().datetime({ offset: true }).optional(),
  }).strict().refine((v) => !v.occurred_after || !v.occurred_before || Date.parse(v.occurred_after) <= Date.parse(v.occurred_before), "occurred_after must not be later than occurred_before"),
  automations: z.object({ workspace_id: Workspace, filter: Filter, limit: z.number().int().min(1).max(200).default(100) }).strict(),
  rateLimits: z.object({ workspace_id: Workspace, since: z.string().datetime({ offset: true }).optional(), until: z.string().datetime({ offset: true }).optional() }).strict(),
  workspaces: z.object({}).strict(),
  deploymentRun: z.object({
    deployment_id: z.string().uuid(),
    parameters: z.record(z.string(), z.unknown()).refine((v) => JSON.stringify(v).length <= 100_000, "parameters are too large").optional(),
    name: z.string().min(1).max(255).optional(),
    tags: z.array(z.string().min(1).max(256)).max(50).optional(),
    idempotency_key: z.string().min(1).max(255).optional(),
    confirm: z.literal("RUN_DEPLOYMENT"),
    approval_token: z.string().min(1),
  }).strict(),
};

export type ToolName =
  | "prefect-cloud.identity.get"
  | "prefect-cloud.workspace.list_authorized"
  | "prefect-cloud.dashboard.get"
  | "prefect-cloud.deployment.list"
  | "prefect-cloud.flow.list"
  | "prefect-cloud.flow_run.list"
  | "prefect-cloud.flow_run.logs"
  | "prefect-cloud.task_run.list"
  | "prefect-cloud.work_pool.list"
  | "prefect-cloud.event.read"
  | "prefect-cloud.automation.list"
  | "prefect-cloud.rate_limit.review"
  | "prefect-cloud.deployment.run";

const FALLBACK_COLLECTIONS: Partial<Record<ToolName, "deployments" | "flows" | "flow_runs" | "task_runs" | "work_pools">> = {
  "prefect-cloud.deployment.list": "deployments",
  "prefect-cloud.flow.list": "flows",
  "prefect-cloud.flow_run.list": "flow_runs",
  "prefect-cloud.task_run.list": "task_runs",
  "prefect-cloud.work_pool.list": "work_pools",
};

const UPSTREAM: Record<Exclude<ToolName, "prefect-cloud.deployment.run">, string> = {
  "prefect-cloud.identity.get": "get_identity",
  "prefect-cloud.workspace.list_authorized": "list_authorized_workspaces",
  "prefect-cloud.dashboard.get": "get_dashboard",
  "prefect-cloud.deployment.list": "get_deployments",
  "prefect-cloud.flow.list": "get_flows",
  "prefect-cloud.flow_run.list": "get_flow_runs",
  "prefect-cloud.flow_run.logs": "get_flow_run_logs",
  "prefect-cloud.task_run.list": "get_task_runs",
  "prefect-cloud.work_pool.list": "get_work_pools",
  "prefect-cloud.event.read": "read_events",
  "prefect-cloud.automation.list": "get_automations",
  "prefect-cloud.rate_limit.review": "review_rate_limits",
};

function configuredWorkspaceId(config: ConnectorConfig): string | undefined {
  if (!config.apiUrl) return undefined;
  const match = config.apiUrl.match(/\/workspaces\/([0-9a-fA-F-]{36})(?:\/|$)/);
  return match?.[1]?.toLowerCase();
}

function assertFallbackWorkspace(config: ConnectorConfig, requested?: unknown): void {
  if (!requested) return;
  const configured = configuredWorkspaceId(config);
  if (!configured || configured !== String(requested).toLowerCase()) {
    throw new Error("REST fallback refused because workspace_id does not match PREFECT_API_URL");
  }
}

async function readWithFallback(
  mcp: PrefectMcpCaller,
  api: PrefectApiClient,
  config: ConnectorConfig,
  name: Exclude<ToolName, "prefect-cloud.deployment.run">,
  args: Record<string, unknown>,
): Promise<unknown> {
  const upstreamArgs = { ...args };
  delete upstreamArgs.offset;
  try {
    return await mcp.call(UPSTREAM[name], upstreamArgs);
  } catch (mcpError) {
    const collection = FALLBACK_COLLECTIONS[name];
    if (collection && config.apiUrl && config.apiKey) {
      assertFallbackWorkspace(config, args.workspace_id);
      return api.filter(collection, args.filter, Number(args.limit ?? 50), Number(args.offset ?? 0));
    }
    if (name === "prefect-cloud.flow_run.logs" && config.apiUrl && config.apiKey) {
      assertFallbackWorkspace(config, args.workspace_id);
      return api.getFlowRunLogs(String(args.flow_run_id), Number(args.limit ?? 100));
    }
    const detail = mcpError instanceof Error ? mcpError.message : "unknown MCP error";
    throw new Error(`Official Prefect MCP call failed and no supported REST fallback is configured for this tool: ${detail}`);
  }
}

export async function invoke(
  mcp: PrefectMcpCaller,
  api: PrefectApiClient,
  config: ConnectorConfig,
  name: ToolName,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (name === "prefect-cloud.deployment.run") {
    requireExecutionEnabled(config);
    requireApproval(config, "HIGH_RISK", String(args.approval_token ?? ""));
    const { deployment_id, parameters, name: runName, tags, idempotency_key } = args;
    return api.createFlowRunFromDeployment(String(deployment_id), {
      ...(parameters ? { parameters: parameters as Record<string, unknown> } : {}),
      ...(runName ? { name: String(runName) } : {}),
      ...(tags ? { tags: tags as string[] } : {}),
      ...(idempotency_key ? { idempotency_key: String(idempotency_key) } : {}),
    });
  }
  return readWithFallback(mcp, api, config, name, args);
}
