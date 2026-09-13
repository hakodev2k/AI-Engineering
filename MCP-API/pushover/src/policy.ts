import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("WRITE operations are disabled by configuration");
    if (!["approved", "approved-high-risk", "approved-destructive"].includes(approval ?? "")) throw new Error("WRITE operation requires explicit approval");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("HIGH_RISK operations are disabled by configuration");
    if (!["approved-high-risk", "approved-destructive"].includes(approval ?? "")) throw new Error("HIGH_RISK operation requires explicit high-risk approval");
    return;
  }
  if (!config.allowDestructive) throw new Error("DESTRUCTIVE operations are disabled by configuration");
  if (approval !== "approved-destructive") throw new Error("DESTRUCTIVE operation requires explicit destructive approval");
}
