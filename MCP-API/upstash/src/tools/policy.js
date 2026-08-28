import crypto from "node:crypto";
import { approvalDigest } from "../auth/config.js";

export const TOOL_POLICY = Object.freeze({
  "upstash.system.ping": { risk: "READ", approval: false },
  "upstash.key.get": { risk: "READ", approval: false },
  "upstash.key.mget": { risk: "READ", approval: false },
  "upstash.key.exists": { risk: "READ", approval: false },
  "upstash.key.ttl": { risk: "READ", approval: false },
  "upstash.key.type": { risk: "READ", approval: false },
  "upstash.key.scan": { risk: "READ", approval: false },
  "upstash.hash.get_all": { risk: "READ", approval: false },
  "upstash.list.range": { risk: "READ", approval: false },
  "upstash.sorted_set.range": { risk: "READ", approval: false },
  "upstash.key.set": { risk: "WRITE", approval: true },
  "upstash.hash.set": { risk: "WRITE", approval: true },
  "upstash.counter.increment": { risk: "WRITE", approval: true },
  "upstash.key.expire": { risk: "WRITE", approval: true },
  "upstash.key.delete": { risk: "DESTRUCTIVE", approval: true }
});

export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === "DESTRUCTIVE" && !config.destructiveEnabled) {
    throw new Error(`${tool} is disabled; set UPSTASH_REDIS_ENABLE_DESTRUCTIVE=true to enable it`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires UPSTASH_REDIS_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval_token for ${tool}`);
}
