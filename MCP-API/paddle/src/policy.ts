import type { PaddleConfig, Permission } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

const requiredPermission: Record<Risk, Permission> = {
  READ: "read",
  WRITE: "write",
  HIGH_RISK: "high_risk",
  DESTRUCTIVE: "destructive"
};

export class PolicyError extends Error {}

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: PaddleConfig): void {
  const permission = requiredPermission[risk];
  if (!config.permissions.has(permission)) throw new PolicyError(`${toolName} requires connector permission ${permission}.`);

  if (risk === "WRITE" && config.requireWriteApproval && args.approval !== "APPROVE_WRITE") {
    throw new PolicyError(`${toolName} requires approval=APPROVE_WRITE.`);
  }
  if (risk === "HIGH_RISK" && args.approval !== "APPROVE_HIGH_RISK") {
    throw new PolicyError(`${toolName} requires approval=APPROVE_HIGH_RISK.`);
  }
  if (risk === "DESTRUCTIVE") {
    if (!config.enableDestructive) throw new PolicyError(`${toolName} is disabled. Set PADDLE_ENABLE_DESTRUCTIVE=true deliberately.`);
    if (args.approval !== "APPROVE_DESTRUCTIVE") throw new PolicyError(`${toolName} requires approval=APPROVE_DESTRUCTIVE.`);
  }
}
