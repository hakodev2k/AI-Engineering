export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function fingerprint(tool: string, args: Record<string, unknown>): string {
  if (tool === "customerio.transactional.email.send") return `${tool}:${String(args.to ?? "")}:${String(args.transactionalMessageId ?? "")}`;
  if (tool === "customerio.reporting_webhook.create") return `${tool}:${String(args.endpoint ?? "")}`;
  if (tool === "customerio.reporting_webhook.delete") return `${tool}:${String(args.webhookId ?? "")}`;
  if (tool === "customerio.segment.create_manual") return `${tool}:${String(args.name ?? "")}`;
  return tool;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; allowDestructive: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  const key = fingerprint(tool, args);
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("Destructive Customer.io operations are disabled.");
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    if (!config.approvedActions.has(key)) throw new Error(`Human approval required: add exact fingerprint to CUSTOMERIO_APPROVED_ACTIONS: ${key}`);
  }
}
