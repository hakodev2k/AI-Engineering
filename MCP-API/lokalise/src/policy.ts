import type { Config } from "./config.js";
export type Risk = "READ" | "WRITE";
export function assertAllowed(risk: Risk, tool: string, args: Record<string, unknown>, config: Config) {
  if (risk === "READ") return;
  if (!config.permissions.has("write")) throw new Error(`${tool} requires WRITE permission.`);
  if (config.requireWriteApproval && args.approved !== true) throw new Error(`${tool} requires explicit human approval: approved=true.`);
}
