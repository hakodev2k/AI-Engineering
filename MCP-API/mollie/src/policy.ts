export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export type Policy = "auto" | "require" | "deny";

export function requireApproval(risk: Risk, approved: boolean | undefined, env: NodeJS.ProcessEnv = process.env): void {
  if (risk === "READ") return;
  const writePolicy = (env.MOLLIE_WRITE_POLICY ?? "require") as Policy;
  const destructivePolicy = (env.MOLLIE_DESTRUCTIVE_POLICY ?? "deny") as Policy;
  const policy = risk === "DESTRUCTIVE" ? destructivePolicy : risk === "HIGH_RISK" ? "require" : writePolicy;
  if (policy === "deny") throw new Error(`${risk} operation is disabled by policy`);
  if (policy === "require" && approved !== true) throw new Error(`${risk} operation requires explicit approval=true`);
}
