export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function accessToken(env = process.env): string {
  const token = env.CALENDLY_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("CALENDLY_ACCESS_TOKEN is required");
  return token;
}

export function requireApproval(risk: Risk, approved?: boolean, env = process.env): void {
  if (risk === "READ") return;
  if (env.CONNECTOR_ALLOW_WRITES !== "true") throw new Error("WRITE_DISABLED: set CONNECTOR_ALLOW_WRITES=true");
  if (!approved) throw new Error(`APPROVAL_REQUIRED:${risk}`);
}
