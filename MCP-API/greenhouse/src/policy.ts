export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function fingerprint(tool: string, args: Record<string, unknown>): string {
  if (tool === "greenhouse.candidate.create") {
    return `${tool}:${String(args.firstName ?? "")}:${String(args.lastName ?? "")}`;
  }
  if (tool === "greenhouse.application.create") {
    return `${tool}:${String(args.candidateId ?? "")}:${String(args.jobId ?? "")}`;
  }
  return tool;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  const mustApprove = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval;
  if (mustApprove) {
    const fp = fingerprint(tool, args);
    if (!config.approvedActions.has(fp)) {
      throw new Error(`Human approval required. Add exact fingerprint to GREENHOUSE_APPROVED_ACTIONS: ${fp}`);
    }
  }
}
