export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function approvalFingerprint(tool: string, args: Record<string, unknown>): string {
  if (tool === "helpscout.conversation.reply.send") return `${tool}:${String(args.conversationId ?? "")}`;
  if (tool === "helpscout.webhook.create") return `${tool}:${String(args.url ?? "")}`;
  if (tool === "helpscout.conversation.tags.replace") return `${tool}:${String(args.conversationId ?? "")}`;
  if (tool.startsWith("helpscout.conversation.")) return `${tool}:${String(args.conversationId ?? "")}`;
  return tool;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; allowDestructive: boolean; approvedActions: Set<string> }
): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("Destructive Help Scout operations are disabled.");
  const requiresApproval = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval;
  if (!requiresApproval) return;
  const fingerprint = approvalFingerprint(tool, args);
  if (!config.approvedActions.has(fingerprint)) {
    throw new Error(`Human approval required. Add this exact fingerprint to HELPSCOUT_APPROVED_ACTIONS: ${fingerprint}`);
  }
}
