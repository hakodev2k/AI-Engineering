export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function approvalFingerprint(tool: string, args: Record<string, unknown>) {
  const site = String(args.siteId ?? args.domain ?? "");
  if (tool === "plausible.guest.invite" || tool === "plausible.guest.remove") {
    return `${tool}:${site}:${String(args.email ?? "")}`;
  }
  if (tool === "plausible.event.track") {
    return `${tool}:${String(args.domain ?? "")}:${String(args.name ?? "")}`;
  }
  if (tool.includes("goal")) return `${tool}:${site}:${String(args.goalId ?? args.eventName ?? args.pagePath ?? "")}`;
  if (tool.includes("custom_property")) return `${tool}:${site}:${String(args.property ?? "")}`;
  return `${tool}:${site}`;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  cfg: { requireWriteApproval: boolean; allowDestructive: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !cfg.allowDestructive) throw new Error("Destructive Plausible operations are disabled.");
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || cfg.requireWriteApproval) {
    const fp = approvalFingerprint(tool, args);
    if (!cfg.approvedActions.has(fp)) throw new Error(`Human approval required. Add exact fingerprint to PLAUSIBLE_APPROVED_ACTIONS: ${fp}`);
  }
}
