export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function fingerprint(tool: string, args: Record<string, unknown>) {
  const target = args.storyId ?? args.name ?? args.slug ?? "global";
  return `${tool}:${String(target)}`;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; allowDestructive: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  const fp = fingerprint(tool, args);
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("Destructive Storyblok operations are disabled.");
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    if (!config.approvedActions.has(fp)) throw new Error(`Human approval required: add exact fingerprint to STORYBLOK_APPROVED_ACTIONS: ${fp}`);
  }
}
