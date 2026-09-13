export type RiskLevel = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface ToolPolicy {
  risk: RiskLevel;
  permission: string;
  approvalRequired: boolean;
}

export const TOOL_POLICIES: Record<string, ToolPolicy> = {
  "hibp.breach.list": { risk: "READ", permission: "breach:read", approvalRequired: false },
  "hibp.breach.get": { risk: "READ", permission: "breach:read", approvalRequired: false },
  "hibp.breach.latest": { risk: "READ", permission: "breach:read", approvalRequired: false },
  "hibp.data_class.list": { risk: "READ", permission: "breach:read", approvalRequired: false },
  "hibp.password.range": { risk: "READ", permission: "password:range:read", approvalRequired: false },
  "hibp.account.breaches": { risk: "READ", permission: "account:breach:read", approvalRequired: false },
  "hibp.account.pastes": { risk: "READ", permission: "account:paste:read", approvalRequired: false },
  "hibp.domain.breaches": { risk: "READ", permission: "domain:breach:read", approvalRequired: false },
  "hibp.domain.subscriptions": { risk: "READ", permission: "domain:subscription:read", approvalRequired: false },
  "hibp.subscription.status": { risk: "READ", permission: "subscription:read", approvalRequired: false }
};

export function assertAllowed(toolName: string, allowedPermissions?: ReadonlySet<string>): void {
  const policy = TOOL_POLICIES[toolName];
  if (!policy) throw new Error(`Unknown tool policy: ${toolName}`);
  if (allowedPermissions && !allowedPermissions.has(policy.permission)) {
    throw new Error(`Permission denied: ${policy.permission}`);
  }
}
