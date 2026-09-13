import type { LemonSqueezyConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export function assertApproved(config: LemonSqueezyConfig, risk: Risk, approved: boolean | undefined): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrite) throw new Error("WRITE tools are disabled; set LEMONSQUEEZY_ALLOW_WRITE=true to enable them");
    if (approved !== true) throw new Error("This WRITE tool requires explicit approved=true");
    return;
  }
  if (!config.allowHighRisk) throw new Error("HIGH_RISK tools are disabled; set LEMONSQUEEZY_ALLOW_HIGH_RISK=true to enable them");
  if (approved !== true) throw new Error("This HIGH_RISK tool requires explicit approved=true");
}
