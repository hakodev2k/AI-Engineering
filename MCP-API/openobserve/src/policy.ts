export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export type ToolPolicy = {
  risk: Risk;
  approvalRequired: boolean;
  description: string;
};

export const TOOL_POLICIES: Record<string, ToolPolicy> = {
  "openobserve.stream.list": { risk: "READ", approvalRequired: false, description: "List stream metadata." },
  "openobserve.stream.schema": { risk: "READ", approvalRequired: false, description: "Read a stream schema and settings." },
  "openobserve.search.sql": { risk: "READ", approvalRequired: false, description: "Run bounded SQL search over telemetry." },
  "openobserve.search.values": { risk: "READ", approvalRequired: false, description: "Read distinct field values." },
  "openobserve.trace.latest": { risk: "READ", approvalRequired: false, description: "Read recent trace summaries." },
  "openobserve.metrics.range_query": { risk: "READ", approvalRequired: false, description: "Run a PromQL range query." },
  "openobserve.search.profile": { risk: "READ", approvalRequired: false, description: "Read search-inspector metadata." },
  "openobserve.cluster.info": { risk: "READ", approvalRequired: false, description: "Read cluster information." }
};

export function assertKnownReadTool(name: string): void {
  const policy = TOOL_POLICIES[name];
  if (!policy) throw new Error(`Tool is not registered in the permission policy: ${name}`);
  if (policy.risk !== "READ" || policy.approvalRequired) {
    throw new Error(`Tool is not permitted for automatic execution: ${name}`);
  }
}
