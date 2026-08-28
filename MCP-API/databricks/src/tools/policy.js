import crypto from "node:crypto";
import { approvalDigest } from "../auth/config.js";

export const TOOL_POLICY = Object.freeze({
  "databricks.cluster.list": { risk: "READ", approval: false },
  "databricks.cluster.get": { risk: "READ", approval: false },
  "databricks.cluster.start": { risk: "HIGH_RISK", approval: true },
  "databricks.cluster.restart": { risk: "HIGH_RISK", approval: true },
  "databricks.cluster.terminate": { risk: "DESTRUCTIVE", approval: true, gate: "enableClusterTerminate" },
  "databricks.job.list": { risk: "READ", approval: false },
  "databricks.job.get": { risk: "READ", approval: false },
  "databricks.job.run.list": { risk: "READ", approval: false },
  "databricks.job.run.get": { risk: "READ", approval: false },
  "databricks.job.run.start": { risk: "HIGH_RISK", approval: true },
  "databricks.job.run.cancel": { risk: "HIGH_RISK", approval: true, gate: "enableJobCancel" },
  "databricks.warehouse.list": { risk: "READ", approval: false },
  "databricks.warehouse.get": { risk: "READ", approval: false },
  "databricks.warehouse.start": { risk: "HIGH_RISK", approval: true },
  "databricks.warehouse.stop": { risk: "HIGH_RISK", approval: true },
  "databricks.sql.statement.execute": { risk: "HIGH_RISK", approval: true },
  "databricks.sql.statement.get": { risk: "READ", approval: false },
  "databricks.sql.statement.cancel": { risk: "HIGH_RISK", approval: true, gate: "enableSqlCancel" }
});

export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.gate && !config[policy.gate]) throw new Error(`${tool} is disabled by configuration`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires DATABRICKS_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);

  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${tool}`);
  }
}
