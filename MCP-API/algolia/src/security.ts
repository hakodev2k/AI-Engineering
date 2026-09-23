export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalError extends Error {}

export function requireWriteApproval(approved: boolean | undefined): void {
  if (process.env.ALGOLIA_WRITE_ENABLED !== "true") throw new ApprovalError("Write tools are disabled. Set ALGOLIA_WRITE_ENABLED=true after policy review.");
  if (approved !== true) throw new ApprovalError("Explicit human approval is required for this write operation.");
}

export function safeIndexName(value: string): string {
  if (!/^[A-Za-z0-9_.-]{1,128}$/.test(value)) throw new Error("Invalid index name");
  return value;
}

export function safeObjectId(value: string): string {
  if (!value || value.length > 512 || /[\r\n]/.test(value)) throw new Error("Invalid objectID");
  return value;
}
