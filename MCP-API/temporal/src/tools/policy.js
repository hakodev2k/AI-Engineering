import crypto from "node:crypto";
import { approvalDigest } from "../auth/config.js";

export const TOOL_POLICY = Object.freeze({
  "temporal.workflow.list": { risk: "READ", approval: false },
  "temporal.workflow.describe": { risk: "READ", approval: false },
  "temporal.workflow.start": { risk: "HIGH_RISK", approval: true },
  "temporal.workflow.signal": { risk: "HIGH_RISK", approval: true },
  "temporal.workflow.query": { risk: "READ", approval: false },
  "temporal.workflow.cancel": { risk: "DESTRUCTIVE", approval: true },
  "temporal.workflow.terminate": { risk: "DESTRUCTIVE", approval: true },
  "temporal.schedule.list": { risk: "READ", approval: false },
  "temporal.schedule.describe": { risk: "READ", approval: false },
  "temporal.schedule.pause": { risk: "HIGH_RISK", approval: true },
  "temporal.schedule.unpause": { risk: "HIGH_RISK", approval: true },
  "temporal.schedule.delete": { risk: "DESTRUCTIVE", approval: true }
});

export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === "DESTRUCTIVE" && !config.destructiveEnabled) {
    throw new Error(`${tool} is disabled; set TEMPORAL_ENABLE_DESTRUCTIVE=true`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires TEMPORAL_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);

  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${tool}`);
  }
}
