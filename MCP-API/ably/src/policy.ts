export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface ApprovalContext { approved?: boolean }

export function requireApproval(risk: Risk, ctx: ApprovalContext, env: NodeJS.ProcessEnv = process.env): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && env.ABLY_ENABLE_DESTRUCTIVE !== "true") {
    throw new Error("Destructive Ably operations are disabled");
  }
  const requireWrite = env.ABLY_REQUIRE_WRITE_APPROVAL !== "false";
  if ((risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || (risk === "WRITE" && requireWrite)) && ctx.approved !== true) {
    throw new Error(`Explicit human approval is required for ${risk} operation`);
  }
}

export function validateChannel(channel: string): string {
  const value = channel.trim();
  if (!value || value.length > 2048 || /[\r\n]/.test(value)) throw new Error("Invalid channel name");
  return value;
}
