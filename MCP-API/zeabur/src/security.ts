export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export class ApprovalError extends Error {}

export function requireApproval(risk: Risk, env: NodeJS.ProcessEnv = process.env): void {
  if (risk === "READ") return;
  if (risk === "WRITE" && env.ZEABUR_APPROVE_WRITE === "true") return;
  if (risk === "HIGH_RISK" && env.ZEABUR_APPROVE_HIGH_RISK === "true") return;
  throw new ApprovalError(`${risk} operation requires explicit human approval`);
}

export function requireToken(env: NodeJS.ProcessEnv = process.env): string {
  const token = env.ZEABUR_TOKEN?.trim();
  if (!token) throw new Error("ZEABUR_TOKEN is required");
  if (/\s/.test(token)) throw new Error("ZEABUR_TOKEN is malformed");
  return token;
}
