export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function fingerprint(tool: string, args: Record<string, unknown>) {
  const target = String(args.userId ?? args.bucketId ?? args.functionId ?? args.name ?? "");
  return `${tool}:${target}`;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; allowDestructive: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("Destructive Appwrite operations are disabled.");
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    const fp = fingerprint(tool, args);
    if (!config.approvedActions.has(fp)) throw new Error(`Human approval required. Add exact fingerprint to APPWRITE_APPROVED_ACTIONS: ${fp}`);
  }
}
