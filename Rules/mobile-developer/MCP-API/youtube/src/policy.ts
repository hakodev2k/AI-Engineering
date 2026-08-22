import type { YouTubeConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function enforceApproval(config: YouTubeConfig, risk: Risk, approved?: boolean): void {
  if (risk === "DESTRUCTIVE") throw new Error("Destructive YouTube operations are disabled by this connector");
  if (risk === "HIGH_RISK" && approved !== true) throw new Error("Explicit human approval is required");
  if (risk === "WRITE" && config.requireWriteApproval && approved !== true) throw new Error("Human approval is required for write operations");
}

export function assertSafeText(value: string, field: string, max: number): string {
  const v = value.trim();
  if (!v) throw new Error(`${field} must not be empty`);
  if (v.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return v;
}
