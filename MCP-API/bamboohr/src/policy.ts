export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function approvalFingerprint(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "bamboohr.time_off.request.create") {
    const employeeId = String(args.employeeId ?? args.employee_id ?? "");
    const start = String(args.start ?? args.startDate ?? args.start_date ?? "");
    const end = String(args.end ?? args.endDate ?? args.end_date ?? "");
    return `${toolName}:${employeeId}:${start}:${end}`;
  }
  if (toolName === "bamboohr.goal.comment.create") {
    const employeeId = String(args.employeeId ?? args.employee_id ?? "");
    const goalId = String(args.goalId ?? args.goal_id ?? "");
    return `${toolName}:${employeeId}:${goalId}`;
  }
  return toolName;
}

export function assertAllowed(
  risk: Risk,
  toolName: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; approvedActions: Set<string> }
): void {
  if (risk === "READ") return;
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE") {
    throw new Error("This connector does not expose high-risk or destructive BambooHR tools.");
  }
  if (config.requireWriteApproval) {
    const fingerprint = approvalFingerprint(toolName, args);
    if (!config.approvedActions.has(fingerprint)) {
      throw new Error(`Human approval required. Add exact fingerprint to BAMBOOHR_APPROVED_ACTIONS: ${fingerprint}`);
    }
  }
}
