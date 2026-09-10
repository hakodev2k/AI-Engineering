import { createHmac, timingSafeEqual } from "node:crypto";
import type { ConnectorConfig } from "./config.js";

export type Risk = "READ" | "DESTRUCTIVE";

export const TOOL_RISK: Record<string, Risk> = {
  "cockroachdb_cloud.cluster.list": "READ",
  "cockroachdb_cloud.cluster.get": "READ",
  "cockroachdb_cloud.cluster.nodes.list": "READ",
  "cockroachdb_cloud.cluster.connection_string.get": "READ",
  "cockroachdb_cloud.cluster.version.list": "READ",
  "cockroachdb_cloud.database.list": "READ",
  "cockroachdb_cloud.sql_user.list": "READ",
  "cockroachdb_cloud.cluster.delete": "DESTRUCTIVE",
  "cockroachdb_cloud.sql_user.delete": "DESTRUCTIVE"
};

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function payloadWithoutApproval(input: Record<string, unknown>): Record<string, unknown> {
  const { approvalId: _approvalId, ...rest } = input;
  return rest;
}

export function createApproval(secret: string, tool: string, input: Record<string, unknown>): string {
  return createHmac("sha256", secret).update(`${tool}\n${canonicalJson(payloadWithoutApproval(input))}`).digest("hex");
}

export function enforcePolicy(tool: string, input: Record<string, unknown>, config: ConnectorConfig): void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error("Unknown tool is not permitted");
  if (risk === "READ") return;

  if (!config.allowDestructive) throw new Error("Destructive operations are disabled by COCKROACH_CLOUD_ALLOW_DESTRUCTIVE");
  if (!config.approvalSecret || config.approvalSecret.length < 16) throw new Error("COCKROACH_CLOUD_APPROVAL_SECRET must contain at least 16 characters");
  const provided = input.approvalId;
  if (typeof provided !== "string" || !/^[a-f0-9]{64}$/i.test(provided)) throw new Error("A valid human approvalId is required");

  const expected = createApproval(config.approvalSecret, tool, input);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(provided, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Approval does not match this exact action and payload");
}
