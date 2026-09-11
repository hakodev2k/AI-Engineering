import type { FreshserviceConfig } from "./config.js";

export type Risk = "READ" | "WRITE";

export function assertAllowed(config: FreshserviceConfig, risk: Risk, approved?: boolean): void {
  if (risk === "READ") return;
  if (!config.allowWrite) throw new Error("WRITE_DISABLED: set FRESHSERVICE_ALLOW_WRITE=true to enable write tools");
  if (approved !== true) throw new Error("APPROVAL_REQUIRED: explicit human approval is required for this write operation");
}
