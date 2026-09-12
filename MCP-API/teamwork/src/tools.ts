import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import type { Upstream } from "./upstream.js";

export interface ToolSpec {
  name: string;
  upstream: string;
  description: string;
  risk: Risk;
  permission: string;
}

export const TOOL_SPECS: ToolSpec[] = [
  { name: "teamwork.project.list", upstream: "twprojects-list_projects", description: "List Teamwork projects using the official MCP project's structured filters.", risk: "READ", permission: "projects:read" },
  { name: "teamwork.project.get", upstream: "twprojects-get_project", description: "Get one Teamwork project by ID.", risk: "READ", permission: "projects:read" },
  { name: "teamwork.project.create", upstream: "twprojects-create_project", description: "Create a Teamwork project. Requires explicit write approval.", risk: "WRITE", permission: "projects:write" },
  { name: "teamwork.task.list", upstream: "twprojects-list_tasks", description: "List tasks site-wide or by project/tasklist using official structured filters.", risk: "READ", permission: "tasks:read" },
  { name: "teamwork.task.get", upstream: "twprojects-get_task", description: "Get one task by ID.", risk: "READ", permission: "tasks:read" },
  { name: "teamwork.task.create", upstream: "twprojects-create_task", description: "Create a task in a tasklist. Requires explicit write approval.", risk: "WRITE", permission: "tasks:write" },
  { name: "teamwork.task.update", upstream: "twprojects-update_task", description: "Update supported fields on an existing task. Requires explicit write approval.", risk: "WRITE", permission: "tasks:write" },
  { name: "teamwork.task.complete", upstream: "twprojects-complete_task", description: "Complete a task. Treated as high risk because it changes workflow state.", risk: "HIGH_RISK", permission: "tasks:write" },
  { name: "teamwork.user.list", upstream: "twprojects-list_users", description: "List Teamwork users visible to the connected account.", risk: "READ", permission: "users:read" },
  { name: "teamwork.user.get", upstream: "twprojects-get_user", description: "Get one Teamwork user by ID.", risk: "READ", permission: "users:read" },
  { name: "teamwork.content.search", upstream: "twprojects-search", description: "Cross-entity keyword search across projects, tasks, messages, comments, users and other supported content.", risk: "READ", permission: "content:read" },
  { name: "teamwork.milestone.list", upstream: "twprojects-list_milestones", description: "List milestones visible to the connected account.", risk: "READ", permission: "milestones:read" },
  { name: "teamwork.timelog.list", upstream: "twprojects-list_timelogs", description: "List individual time entries using official Teamwork filters.", risk: "READ", permission: "time:read" },
  { name: "teamwork.timelog.create", upstream: "twprojects-create_timelog", description: "Create a time entry. Requires explicit write approval.", risk: "WRITE", permission: "time:write" },
  { name: "teamwork.timelog.summarize", upstream: "twprojects-summarize_timelogs", description: "Return complete time totals for a date window grouped by supported Teamwork dimensions.", risk: "READ", permission: "time:read" }
];

export const UPSTREAM_ALLOWLIST = new Set(TOOL_SPECS.map((spec) => spec.upstream));

const inputShape = {
  params: z.record(z.unknown()).default({}).describe("Arguments for the fixed mapped official Teamwork MCP tool. The connector validates this object against that tool's live JSON Schema before dispatch."),
  approval: z.enum(["approved", "approved-high-risk"]).optional().describe("Required for WRITE or HIGH_RISK operations according to connector policy.")
};

function safeJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "string" && item.length > 200_000 ? `${item.slice(0, 200_000)}…[truncated]` : item, 2);
}

export async function executeTool(spec: ToolSpec, params: Record<string, unknown>, approval: string | undefined, upstream: Upstream, config: Config): Promise<unknown> {
  requireApproval(spec.risk, approval, config);
  return upstream.callTool(spec.upstream, params, spec.risk === "READ");
}

export function registerTools(server: McpServer, upstream: Upstream, config: Config): void {
  for (const spec of TOOL_SPECS) {
    server.tool(spec.name, `${spec.description} Permission: ${spec.permission}. Risk: ${spec.risk}.`, inputShape, async ({ params, approval }) => {
      const result = await executeTool(spec, params, approval, upstream, config);
      return {
        content: [{
          type: "text",
          text: safeJson({ provider: "Teamwork.com", tool: spec.name, permission: spec.permission, risk: spec.risk, untrusted_provider_content: true, result })
        }]
      };
    });
  }
}
