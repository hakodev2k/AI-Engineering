import type { Config, Permission } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export interface ToolPolicy { permission: Permission; risk: Risk; approval: "none" | "configurable" | "explicit"; }

export function assertAllowed(policy: ToolPolicy, args: Record<string, unknown>, config: Config): void {
  if (!config.permissions.has(policy.permission)) throw new Error(`Permission denied: ${policy.permission} is not enabled.`);
  const approved = args.approved === true;
  if (policy.permission === "send") {
    if (!config.enableSend) throw new Error("Sending is disabled. Set FRONT_ENABLE_SEND=true only after establishing human approval controls.");
    if (!approved) throw new Error("Explicit human approval is required before sending an external message.");
  } else if (policy.risk === "HIGH_RISK" || policy.risk === "DESTRUCTIVE") {
    if (!approved) throw new Error("Explicit human approval is required for this operation.");
  } else if (policy.permission === "write" && config.requireWriteApproval && !approved) {
    throw new Error("Human approval is required for write operations by policy.");
  }
}
