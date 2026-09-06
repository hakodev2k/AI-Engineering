import type { Config, CloseMcpScope } from "./config.js";
import type { ToolPolicy } from "./registry.js";
import { requiredUpstreamScope } from "./registry.js";

const permissionRank = { read:0, write:1, high_risk:2 } as const;
const scopeRank: Record<CloseMcpScope, number> = { "mcp.read":0, "mcp.write_safe":1, "mcp.write_destructive":2 };

export interface ApprovalEnvelope {
  approved?: boolean;
  approvalReason?: string;
}

export function assertPolicy(tool: ToolPolicy, args: Record<string, unknown>, config: Config): void {
  const neededPermission = tool.risk === "READ" ? 0 : tool.risk === "WRITE" ? 1 : 2;
  if (permissionRank[config.permission] < neededPermission) throw new Error(`Permission denied: ${tool.alias} requires ${tool.risk}.`);

  const neededScope = requiredUpstreamScope(tool.risk);
  if (scopeRank[config.upstreamScope] < scopeRank[neededScope]) throw new Error(`Upstream Close scope ${config.upstreamScope} is insufficient; ${neededScope} is required.`);

  if (tool.risk === "WRITE" && config.requireWriteApproval && args.approved !== true) {
    throw new Error(`Human approval required for ${tool.alias}. Pass approved=true only after approval is obtained.`);
  }

  if (tool.risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error(`High-risk tool ${tool.alias} is disabled. Set CLOSE_ALLOW_HIGH_RISK=true deliberately.`);
    if (args.approved !== true || typeof args.approvalReason !== "string" || args.approvalReason.trim().length < 3) {
      throw new Error(`Explicit human approval and approvalReason are required for ${tool.alias}.`);
    }
  }
}

export function sanitizeArguments(input: unknown): Record<string, unknown> {
  if (input === undefined || input === null) return {};
  if (typeof input !== "object" || Array.isArray(input)) throw new Error("Tool arguments must be an object.");
  const clone = structuredClone(input) as Record<string, unknown>;
  delete clone.approved;
  delete clone.approvalReason;
  validateSize(clone, 0);
  return clone;
}

function validateSize(value: unknown, depth: number): void {
  if (depth > 12) throw new Error("Tool arguments exceed maximum nesting depth.");
  if (typeof value === "string" && value.length > 100_000) throw new Error("A string argument exceeds 100000 characters.");
  if (Array.isArray(value)) {
    if (value.length > 1000) throw new Error("An array argument exceeds 1000 items.");
    for (const item of value) validateSize(item, depth + 1);
  } else if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > 250) throw new Error("An object argument exceeds 250 properties.");
    for (const [, item] of entries) validateSize(item, depth + 1);
  }
}
