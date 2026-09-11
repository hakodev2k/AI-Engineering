import type { QuoConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function assertAllowed(config: QuoConfig, risk: Risk, approved = false): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.QUO_APPROVE_WRITES && !approved) throw new Error("APPROVAL_REQUIRED: write operation requires approval");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.QUO_APPROVE_HIGH_RISK || !approved) throw new Error("APPROVAL_REQUIRED: high-risk operation requires explicit approval");
    return;
  }
  if (!config.QUO_ENABLE_DESTRUCTIVE || !approved) throw new Error("DESTRUCTIVE_DISABLED: enable destructive actions and provide explicit approval");
}
