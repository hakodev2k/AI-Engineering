import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import type { FormioUpstream } from "./upstream.js";

export interface ToolSpec { name: string; upstream: string; description: string; risk: Risk; }

export const TOOL_SPECS: ToolSpec[] = [
  { name: "formio.form.list", upstream: "form_list", description: "List forms with filtering and pagination.", risk: "READ" },
  { name: "formio.form.get", upstream: "form_get", description: "Read one form definition by id or path.", risk: "READ" },
  { name: "formio.form.create", upstream: "form_create", description: "Create a form from a validated Form.io definition.", risk: "WRITE" },
  { name: "formio.form.update", upstream: "form_update", description: "Update an existing form after reading its current definition.", risk: "WRITE" },
  { name: "formio.form.revisions.list", upstream: "form_revisions_list", description: "List saved form revisions.", risk: "READ" },
  { name: "formio.form.revision.get", upstream: "form_revision_get", description: "Read a saved form revision.", risk: "READ" },
  { name: "formio.role.list", upstream: "role_list", description: "List project roles.", risk: "READ" },
  { name: "formio.role.create", upstream: "role_create", description: "Create a project role.", risk: "HIGH_RISK" },
  { name: "formio.role.update", upstream: "role_update", description: "Replace a project role definition; permission-sensitive.", risk: "HIGH_RISK" },
  { name: "formio.action.type.list", upstream: "action_types_list", description: "List server action types.", risk: "READ" },
  { name: "formio.action.type.get", upstream: "action_type_get", description: "Read an action type settings schema.", risk: "READ" },
  { name: "formio.action.list", upstream: "action_list", description: "List actions attached to a form.", risk: "READ" },
  { name: "formio.action.get", upstream: "action_get", description: "Read one form action.", risk: "READ" },
  { name: "formio.action.create", upstream: "action_create", description: "Attach an action to a form.", risk: "HIGH_RISK" },
  { name: "formio.action.update", upstream: "action_update", description: "Update a form action.", risk: "HIGH_RISK" },
  { name: "formio.action.delete", upstream: "action_delete", description: "Detach an action from a form.", risk: "DESTRUCTIVE" },
  { name: "formio.project.get", upstream: "project_get", description: "Resolve the active Form.io project and deployment for a working directory.", risk: "READ" },
  { name: "formio.project.export", upstream: "project_export", description: "Export the full project template for review or backup.", risk: "READ" },
  { name: "formio.project.import", upstream: "project_import", description: "Import a project template; existing same-machine-name resources may be overwritten.", risk: "HIGH_RISK" }
];

export const EXPECTED_UPSTREAM_TOOLS = TOOL_SPECS.map((spec) => spec.upstream);

const inputShape = {
  params: z.record(z.unknown()).default({}).describe("Arguments forwarded only to the fixed allowlisted official Form.io MCP tool, which performs provider-side schema validation."),
  approval: z.enum(["approved", "approved-high-risk", "approved-destructive"]).optional()
};

function safeJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "string" && item.length > 200_000 ? `${item.slice(0, 200_000)}…[truncated]` : item, 2);
}

export async function executeTool(spec: ToolSpec, params: Record<string, unknown>, approval: string | undefined, upstream: FormioUpstream, config: Config): Promise<unknown> {
  requireApproval(spec.risk, approval, config);
  return upstream.callTool(spec.upstream, params);
}

export function registerTools(server: McpServer, upstream: FormioUpstream, config: Config): void {
  for (const spec of TOOL_SPECS) {
    server.tool(spec.name, spec.description, inputShape, async ({ params, approval }) => {
      const result = await executeTool(spec, params, approval, upstream, config);
      return { content: [{ type: "text", text: safeJson({ provider: "Form.io", tool: spec.name, risk: spec.risk, untrusted_provider_content: true, result }) }] };
    });
  }
}
