export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function approvalFingerprint(tool: string, args: Record<string, unknown>): string {
  if (tool === "gusto.employee.create") return `${tool}:${String(args.companyId ?? "")}:${String(args.email ?? args.workEmail ?? args.firstName ?? "")}`;
  if (tool === "gusto.employee.update") return `${tool}:${String(args.employeeId ?? "")}:${String(args.version ?? "")}`;
  if (tool === "gusto.payroll.prepare") return `${tool}:${String(args.companyId ?? "")}:${String(args.payrollId ?? "")}`;
  return tool;
}

export function assertAllowed(
  risk: Risk,
  tool: string,
  args: Record<string, unknown>,
  config: { requireWriteApproval: boolean; approvedActions: Set<string> }
): void {
  if (risk === "READ") return;
  const fingerprint = approvalFingerprint(tool, args);
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    if (!config.approvedActions.has(fingerprint)) {
      throw new Error(`Human approval required. Add exact fingerprint to GUSTO_APPROVED_ACTIONS: ${fingerprint}`);
    }
  }
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Gusto tools are not exposed by this connector.");
}
