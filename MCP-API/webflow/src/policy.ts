import type { WebflowConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: WebflowConfig) {
  if (risk === "READ") return;
  if (config.permissions !== "write") throw new Error(`${toolName} requires WEBFLOW_PERMISSIONS=write.`);
  const approved = args.approval === true;
  if (risk === "WRITE" && config.requireWriteApproval && !approved) {
    throw new Error(`${toolName} requires approval=true because write approval is enabled.`);
  }
  if (risk === "HIGH_RISK" && !approved) throw new Error(`${toolName} requires explicit human approval=true.`);
  if (risk === "DESTRUCTIVE") {
    if (!config.allowDestructive) throw new Error(`${toolName} is disabled. Set WEBFLOW_ALLOW_DESTRUCTIVE=true to enable it.`);
    if (!approved) throw new Error(`${toolName} requires explicit human approval=true.`);
  }
}
