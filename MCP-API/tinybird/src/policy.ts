import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export class Policy {
  constructor(private readonly config: Pick<Config, "allowWrite" | "approvedActionIds">) {}

  assert(risk: Risk, approvalId?: string): void {
    if (risk === "READ") return;
    if (!this.config.allowWrite) throw new PermissionError("Write operations are disabled. Set TINYBIRD_ALLOW_WRITE=true out of band.");
    if (!approvalId || !this.config.approvedActionIds.has(approvalId)) {
      throw new PermissionError("This operation requires an approval_id that the host has allow-listed in TINYBIRD_APPROVED_ACTION_IDS.");
    }
    if (risk === "DESTRUCTIVE") throw new PermissionError("Destructive operations are not enabled by this connector.");
  }
}
