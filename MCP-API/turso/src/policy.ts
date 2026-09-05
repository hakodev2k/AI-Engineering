export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export type Approval = { confirmed?: boolean; reason?: string };

export function assertAllowed(
  risk: Risk,
  approval: Approval | undefined,
  config: { allowWrite: boolean; approvalMode: "required" | "disabled" }
): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Turso operations are disabled by this connector.");
  if (!config.allowWrite) throw new Error("Write operations are disabled because TURSO_ALLOW_WRITE=false.");
  if (config.approvalMode === "required" && (!approval?.confirmed || !approval.reason?.trim())) {
    throw new Error("Explicit human approval is required with approval.confirmed=true and a non-empty approval.reason.");
  }
}
