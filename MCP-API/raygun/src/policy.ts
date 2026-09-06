import type { Config, Permission } from "./config.js";
import type { ToolBinding } from "./catalog.js";

const rank: Record<Permission, number> = { read:0, write:1, high_risk:2, destructive:3 };

export function assertAllowed(binding: ToolBinding, args: Record<string, unknown>, config: Config): void {
  if (rank[binding.permission] > rank[config.maxPermission]) {
    throw new Error(`Permission denied: ${binding.publicName} requires ${binding.permission.toUpperCase()}.`);
  }
  if (binding.permission === "destructive" && !config.enableDestructive) {
    throw new Error("Destructive Raygun operations are disabled by policy.");
  }
  const approval = args.approval;
  if (binding.permission === "write" && config.requireWriteApproval && approval !== "APPROVE_WRITE") {
    throw new Error("Explicit human approval required: set approval to APPROVE_WRITE.");
  }
  if (binding.permission === "high_risk" && config.requireHighRiskApproval && approval !== "APPROVE_HIGH_RISK") {
    throw new Error("Explicit human approval required: set approval to APPROVE_HIGH_RISK.");
  }
  if (binding.permission === "destructive" && approval !== "APPROVE_DESTRUCTIVE") {
    throw new Error("Explicit strong human approval required: set approval to APPROVE_DESTRUCTIVE.");
  }
}

export function stripConnectorFields(args: Record<string, unknown>): Record<string, unknown> {
  const { approval: _approval, ...upstreamArgs } = args;
  return upstreamArgs;
}

export function addApprovalToSchema(schema: Record<string, unknown>, binding: ToolBinding): Record<string, unknown> {
  if (!binding.approval) return schema;
  const properties = { ...((schema.properties as Record<string, unknown> | undefined) ?? {}) };
  properties.approval = {
    type: "string",
    enum: [binding.approval],
    description: "Explicit human approval token enforced locally by this connector."
  };
  const required = Array.isArray(schema.required) ? [...schema.required] : [];
  if (!required.includes("approval")) required.push("approval");
  return { ...schema, type:"object", properties, required, additionalProperties: schema.additionalProperties ?? false };
}
