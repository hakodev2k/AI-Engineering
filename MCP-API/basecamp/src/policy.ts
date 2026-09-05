export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function fingerprint(tool: string, args: Record<string, unknown>) {
  switch (tool) {
    case "basecamp.todo.create": return `${tool}:${String(args.todolistId ?? "")}:${String(args.content ?? "")}`;
    case "basecamp.todo.complete":
    case "basecamp.todo.uncomplete": return `${tool}:${String(args.todoId ?? "")}`;
    case "basecamp.message.draft.create": return `${tool}:${String(args.messageBoardId ?? "")}:${String(args.subject ?? "")}`;
    case "basecamp.message.publish": return `${tool}:${String(args.messageId ?? "")}`;
    case "basecamp.comment.create": return `${tool}:${String(args.recordingId ?? "")}`;
    default: return tool;
  }
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; approvedActions: Set<string> }
) {
  if (risk === "READ") return;
  const fp = fingerprint(tool, args);
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    if (!config.approvedActions.has(fp)) {
      throw new Error(`Human approval required. Add exact fingerprint to BASECAMP_APPROVED_ACTIONS: ${fp}`);
    }
  }
}
