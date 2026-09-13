import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import type { OperationKey, Upstream } from "./upstream.js";

export interface ToolSpec {
  name: string;
  operation: OperationKey;
  purpose: string;
  risk: Risk;
  permission: string;
  approval: "none" | "write" | "high-risk";
}

export const TOOL_SPECS: ToolSpec[] = [
  { name: "persona.inquiry.list", operation: "inquiry.list", purpose: "List identity verification inquiries with Persona-supported pagination and filters.", risk: "READ", permission: "inquiry.read", approval: "none" },
  { name: "persona.inquiry.get", operation: "inquiry.get", purpose: "Retrieve one inquiry and its allowed related resources.", risk: "READ", permission: "inquiry.read", approval: "none" },
  { name: "persona.inquiry.search", operation: "inquiry.search", purpose: "Search inquiries using Persona's supported search criteria.", risk: "READ", permission: "inquiry.read", approval: "none" },
  { name: "persona.inquiry.create", operation: "inquiry.create", purpose: "Create an inquiry from a configured inquiry template. This changes external state.", risk: "WRITE", permission: "inquiry.write", approval: "write" },
  { name: "persona.account.list", operation: "account.list", purpose: "List Persona accounts.", risk: "READ", permission: "account.read", approval: "none" },
  { name: "persona.account.get", operation: "account.get", purpose: "Retrieve a Persona account by ID.", risk: "READ", permission: "account.read", approval: "none" },
  { name: "persona.case.list", operation: "case.list", purpose: "List review cases available to the API key.", risk: "READ", permission: "case.read", approval: "none" },
  { name: "persona.case.get", operation: "case.get", purpose: "Retrieve one review case by ID.", risk: "READ", permission: "case.read", approval: "none" },
  { name: "persona.verification.get", operation: "verification.get", purpose: "Retrieve a verification result by ID.", risk: "READ", permission: "verification.read", approval: "none" },
  { name: "persona.report.get", operation: "report.get", purpose: "Retrieve a generated Persona report by ID.", risk: "READ", permission: "report.read", approval: "none" },
  { name: "persona.transaction.get", operation: "transaction.get", purpose: "Retrieve a Persona transaction by ID.", risk: "READ", permission: "txn.read", approval: "none" },
  { name: "persona.webhook.list", operation: "webhook.list", purpose: "List configured Persona webhooks without modifying them.", risk: "READ", permission: "webhook.read", approval: "none" }
];

const inputShape = {
  params: z.record(z.unknown()).default({}).describe("Arguments for this fixed Persona operation. The connector validates them again against the official live Persona MCP input schema before execution."),
  approval: z.enum(["approved", "approved-high-risk"]).optional().describe("Human approval token. Required only for state-changing tools.")
};

function safeJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "string" && item.length > 200_000 ? `${item.slice(0, 200_000)}…[truncated]` : item, 2);
}

export async function executeTool(spec: ToolSpec, params: Record<string, unknown>, approval: string | undefined, upstream: Upstream, config: Config): Promise<unknown> {
  requireApproval(spec.risk, approval, config);
  return upstream.call(spec.operation, params);
}

export function registerTools(server: McpServer, upstream: Upstream, config: Config): void {
  for (const spec of TOOL_SPECS) {
    server.tool(spec.name, `${spec.purpose} Required Persona permission: ${spec.permission}. Risk: ${spec.risk}.`, inputShape, async ({ params, approval }) => {
      const result = await executeTool(spec, params, approval, upstream, config);
      return {
        content: [{
          type: "text",
          text: safeJson({
            provider: "Persona",
            tool: spec.name,
            risk: spec.risk,
            required_permission: spec.permission,
            untrusted_provider_content: true,
            result
          })
        }]
      };
    });
  }
}
