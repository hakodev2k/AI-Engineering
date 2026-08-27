import crypto from "node:crypto";
import { approvalDigest } from "./config.js";

export const TOOL_POLICY = Object.freeze({
  "meilisearch.system.health": { risk: "READ", approval: false },
  "meilisearch.system.version": { risk: "READ", approval: false },
  "meilisearch.index.list": { risk: "READ", approval: false },
  "meilisearch.index.get": { risk: "READ", approval: false },
  "meilisearch.index.create": { risk: "WRITE", approval: true },
  "meilisearch.index.update": { risk: "WRITE", approval: true },
  "meilisearch.index.delete": { risk: "DESTRUCTIVE", approval: true },
  "meilisearch.search.query": { risk: "READ", approval: false },
  "meilisearch.document.list": { risk: "READ", approval: false },
  "meilisearch.document.get": { risk: "READ", approval: false },
  "meilisearch.document.add_or_update": { risk: "WRITE", approval: true },
  "meilisearch.document.delete": { risk: "DESTRUCTIVE", approval: true },
  "meilisearch.settings.get": { risk: "READ", approval: false },
  "meilisearch.settings.update": { risk: "HIGH_RISK", approval: true },
  "meilisearch.task.get": { risk: "READ", approval: false },
  "meilisearch.task.list": { risk: "READ", approval: false },
  "meilisearch.task.cancel": { risk: "HIGH_RISK", approval: true }
});

export function assertAuthorized(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);

  if (policy.risk === "DESTRUCTIVE" && !config.enableDestructive) {
    throw new Error(`${tool} is disabled; set MEILISEARCH_ENABLE_DESTRUCTIVE=true to enable it`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires MEILISEARCH_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);

  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${tool}`);
  }
}
