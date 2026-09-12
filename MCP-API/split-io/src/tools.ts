import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { SplitClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

const approval = z.enum(["approved", "approved-high-risk"]).optional();
const workspaceId = z.string().min(1).max(200);
const featureFlagName = z.string().min(1).max(200);
const environment = z.string().min(1).max(200);
const pagination = { offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(50).default(20) };

export interface ToolSpec { name: string; risk: Risk; description: string; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "split.feature_flag.list", risk: "READ", description: "List feature flags in a Split workspace." },
  { name: "split.feature_flag.get", risk: "READ", description: "Get feature flag metadata." },
  { name: "split.feature_flag.create", risk: "WRITE", description: "Create feature flag metadata for a traffic type; does not configure any environment." },
  { name: "split.feature_flag.description.update", risk: "WRITE", description: "Update a feature flag description." },
  { name: "split.feature_flag_definition.list", risk: "READ", description: "List feature flag definitions configured in an environment." },
  { name: "split.feature_flag_definition.get", risk: "READ", description: "Get a feature flag definition in an environment." },
  { name: "split.feature_flag_definition.create", risk: "HIGH_RISK", description: "Configure a feature flag in an environment. Explicit high-risk approval is required." },
  { name: "split.feature_flag_definition.patch", risk: "HIGH_RISK", description: "Apply allowlisted JSON Patch operations to an environment definition. Explicit high-risk approval is required." }
];

function enc(value: string): string { return encodeURIComponent(value); }
function output(tool: string, risk: Risk, result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "Split.io", tool, risk, untrusted_provider_content: true, result }, null, 2) }] };
}

export function registerTools(server: McpServer, client: SplitClient, config: Config): void {
  server.tool("split.feature_flag.list", TOOL_SPECS[0].description, {
    workspaceId,
    ...pagination,
    tags: z.array(z.string().min(1).max(100)).max(20).optional()
  }, async ({ workspaceId, offset, limit, tags }) => {
    const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    for (const tag of tags ?? []) query.append("tag", tag);
    const result = await client.request("GET", `/internal/api/v2/splits/ws/${enc(workspaceId)}/?${query}`);
    return output("split.feature_flag.list", "READ", result);
  });

  server.tool("split.feature_flag.get", TOOL_SPECS[1].description, { workspaceId, featureFlagName }, async ({ workspaceId, featureFlagName }) => {
    const result = await client.request("GET", `/internal/api/v2/splits/ws/${enc(workspaceId)}/${enc(featureFlagName)}`);
    return output("split.feature_flag.get", "READ", result);
  });

  server.tool("split.feature_flag.create", TOOL_SPECS[2].description, {
    workspaceId,
    trafficType: z.string().min(1).max(200),
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    owners: z.array(z.object({ id: z.string().min(1).max(200), type: z.enum(["User", "Team"]) }).strict()).max(50).optional(),
    approval
  }, async ({ workspaceId, trafficType, name, description, owners, approval }) => {
    requireApproval("WRITE", approval, config);
    const body = { name, ...(description !== undefined ? { description } : {}), ...(owners ? { owners } : {}) };
    const result = await client.request("POST", `/internal/api/v2/splits/ws/${enc(workspaceId)}/trafficTypes/${enc(trafficType)}`, body);
    return output("split.feature_flag.create", "WRITE", result);
  });

  server.tool("split.feature_flag.description.update", TOOL_SPECS[3].description, {
    workspaceId,
    featureFlagName,
    description: z.string().max(1000),
    approval
  }, async ({ workspaceId, featureFlagName, description, approval }) => {
    requireApproval("WRITE", approval, config);
    const result = await client.request("PUT", `/internal/api/v2/splits/ws/${enc(workspaceId)}/${enc(featureFlagName)}/updateDescription`, { description });
    return output("split.feature_flag.description.update", "WRITE", result);
  });

  server.tool("split.feature_flag_definition.list", TOOL_SPECS[4].description, {
    workspaceId,
    environment,
    ...pagination,
    flagSetIds: z.array(z.string().min(1).max(200)).max(50).optional()
  }, async ({ workspaceId, environment, offset, limit, flagSetIds }) => {
    const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    if (flagSetIds?.length) query.set("flag_sets", flagSetIds.join(","));
    const result = await client.request("GET", `/internal/api/v2/splits/ws/${enc(workspaceId)}/environments/${enc(environment)}?${query}`);
    return output("split.feature_flag_definition.list", "READ", result);
  });

  server.tool("split.feature_flag_definition.get", TOOL_SPECS[5].description, { workspaceId, featureFlagName, environment }, async ({ workspaceId, featureFlagName, environment }) => {
    const result = await client.request("GET", `/internal/api/v2/splits/ws/${enc(workspaceId)}/${enc(featureFlagName)}/environments/${enc(environment)}`);
    return output("split.feature_flag_definition.get", "READ", result);
  });

  const treatment = z.object({ name: z.string().min(1).max(200), configurations: z.record(z.string(), z.string()).optional() }).passthrough();
  const bucket = z.object({ treatment: z.string().min(1).max(200), size: z.number().min(0).max(100) }).strict();
  server.tool("split.feature_flag_definition.create", TOOL_SPECS[6].description, {
    workspaceId,
    featureFlagName,
    environment,
    treatments: z.array(treatment).min(2).max(50),
    defaultTreatment: z.string().min(1).max(200),
    defaultRule: z.array(bucket).min(1).max(50),
    rules: z.array(z.record(z.string(), z.unknown())).max(100).optional(),
    comment: z.string().max(1000).optional(),
    approval
  }, async ({ workspaceId, featureFlagName, environment, treatments, defaultTreatment, defaultRule, rules, comment, approval }) => {
    requireApproval("HIGH_RISK", approval, config);
    const body = { treatments, defaultTreatment, defaultRule, ...(rules ? { rules } : {}), ...(comment ? { comment } : {}) };
    const result = await client.request("POST", `/internal/api/v2/splits/ws/${enc(workspaceId)}/${enc(featureFlagName)}/environments/${enc(environment)}`, body);
    return output("split.feature_flag_definition.create", "HIGH_RISK", result);
  });

  const patch = z.object({
    op: z.enum(["add", "replace", "remove"]),
    path: z.string().regex(/^\/(killed|defaultTreatment|defaultRule|rules|treatments|trafficAllocation)(\/.*)?$/),
    value: z.unknown().optional()
  }).strict().superRefine((item, ctx) => {
    if (item.op !== "remove" && item.value === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "value is required for add/replace" });
  });
  server.tool("split.feature_flag_definition.patch", TOOL_SPECS[7].description, {
    workspaceId,
    featureFlagName,
    environment,
    operations: z.array(patch).min(1).max(20),
    title: z.string().max(200).optional(),
    comment: z.string().max(1000).optional(),
    approval
  }, async ({ workspaceId, featureFlagName, environment, operations, title, comment, approval }) => {
    requireApproval("HIGH_RISK", approval, config);
    const query = new URLSearchParams();
    if (title) query.set("title", title);
    if (comment) query.set("comment", comment);
    const suffix = query.size ? `?${query}` : "";
    const result = await client.request("PATCH", `/internal/api/v2/splits/ws/${enc(workspaceId)}/${enc(featureFlagName)}/environments/${enc(environment)}${suffix}`, operations);
    return output("split.feature_flag_definition.patch", "HIGH_RISK", result);
  });
}
