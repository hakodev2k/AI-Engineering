import crypto from "node:crypto";
import { approvalDigest } from "./config.js";

export const TOOL_POLICY = Object.freeze({
  "cloudsmith.namespace.list": { risk: "READ", approval: false },
  "cloudsmith.repository.list": { risk: "READ", approval: false },
  "cloudsmith.package.list": { risk: "READ", approval: false },
  "cloudsmith.package.get": { risk: "READ", approval: false },
  "cloudsmith.package.dependencies": { risk: "READ", approval: false },
  "cloudsmith.package.vulnerabilities": { risk: "READ", approval: false },
  "cloudsmith.package.metrics": { risk: "READ", approval: false },
  "cloudsmith.package.copy": { risk: "WRITE", approval: true },
  "cloudsmith.package.move": { risk: "HIGH_RISK", approval: true },
  "cloudsmith.package.quarantine": { risk: "HIGH_RISK", approval: true },
  "cloudsmith.package.release": { risk: "HIGH_RISK", approval: true },
  "cloudsmith.package.delete": { risk: "DESTRUCTIVE", approval: true }
});

export function assertAuthorized(config, tool, payload, token) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk === "DESTRUCTIVE" && !config.enableDestructive) throw new Error(`${tool} is disabled; set CLOUDSMITH_ENABLE_DESTRUCTIVE=true to enable it`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires CLOUDSMITH_APPROVAL_SECRET`);
  if (!token) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval_token for ${tool}`);
}
