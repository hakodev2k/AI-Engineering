import type { AirwallexConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function enforceRisk(config: AirwallexConfig, risk: Risk): void {
  if (risk === "READ") return;
  if (risk === "WRITE" && config.writeMode !== "allow") {
    throw new Error("Write operation blocked by AIRWALLEX_WRITE_MODE=deny");
  }
  if ((risk === "HIGH_RISK" || risk === "DESTRUCTIVE") && config.highRiskMode !== "allow") {
    throw new Error("High-risk operation blocked by AIRWALLEX_HIGH_RISK_MODE=deny");
  }
}

export const TOOL_RISK = {
  "airwallex.balance.current": "READ",
  "airwallex.balance.history": "READ",
  "airwallex.beneficiary.list": "READ",
  "airwallex.beneficiary.get": "READ",
  "airwallex.beneficiary.validate": "READ",
  "airwallex.beneficiary.create": "HIGH_RISK",
  "airwallex.beneficiary.update": "HIGH_RISK",
  "airwallex.transfer.list": "READ",
  "airwallex.transfer.get": "READ",
  "airwallex.transfer.validate": "READ",
  "airwallex.transfer.create": "HIGH_RISK",
  "airwallex.transfer.cancel": "DESTRUCTIVE",
  "airwallex.webhook.list": "READ"
} as const satisfies Record<string, Risk>;
