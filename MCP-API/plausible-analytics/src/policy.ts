export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface ToolPolicy {
  risk: Risk;
  approvalRequired: boolean;
}

export const policies: Record<string, ToolPolicy> = {
  "plausible.stats.query": { risk: "READ", approvalRequired: false },
  "plausible.stats.overview": { risk: "READ", approvalRequired: false },
  "plausible.stats.timeseries": { risk: "READ", approvalRequired: false },
  "plausible.stats.pages": { risk: "READ", approvalRequired: false },
  "plausible.stats.sources": { risk: "READ", approvalRequired: false },
  "plausible.stats.countries": { risk: "READ", approvalRequired: false },
  "plausible.stats.devices": { risk: "READ", approvalRequired: false },
  "plausible.stats.goals": { risk: "READ", approvalRequired: false },
  "plausible.stats.realtime": { risk: "READ", approvalRequired: false },
  "plausible.event.pageview": { risk: "WRITE", approvalRequired: true },
  "plausible.event.custom": { risk: "WRITE", approvalRequired: true }
};

export function requireApproval(tool: string, approved: boolean | undefined, writesEnabled: boolean): void {
  const policy = policies[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk !== "READ" && !writesEnabled) throw new Error("Event writes are disabled by configuration");
  if (policy.approvalRequired && approved !== true) throw new Error("Explicit human approval is required");
}
