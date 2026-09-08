import test from "node:test";
import assert from "node:assert/strict";
import { approvalDigest, enforcePolicy, RISK } from "../src/policy.js";

const base = { approvalSecret: "operator-secret", requireWriteApproval: true, enableDestructive: false };

test("READ does not require approval", () => {
  assert.doesNotThrow(() => enforcePolicy(base, { name: "porkbun.domain.get", risk: RISK.READ }, {}));
});

test("WRITE approval is bound to exact tool and payload", () => {
  const tool = { name: "porkbun.dns.record.create", risk: RISK.WRITE };
  const args = { domain: "example.com", name: "www", type: "A", content: "192.0.2.10" };
  const token = approvalDigest(base.approvalSecret, tool.name, args);
  assert.doesNotThrow(() => enforcePolicy(base, tool, { ...args, approval_token: token }));
  assert.throws(() => enforcePolicy(base, tool, { ...args, content: "192.0.2.11", approval_token: token }), /INVALID_APPROVAL/);
});

test("HIGH_RISK always requires approval even if ordinary write approval is off", () => {
  const cfg = { ...base, requireWriteApproval: false };
  assert.throws(() => enforcePolicy(cfg, { name: "porkbun.nameserver.update", risk: RISK.HIGH_RISK }, { domain: "example.com" }), /HUMAN_APPROVAL_REQUIRED/);
});

test("DESTRUCTIVE is disabled by default", () => {
  assert.throws(() => enforcePolicy(base, { name: "porkbun.dns.record.delete", risk: RISK.DESTRUCTIVE }, { domain: "example.com", record_id: "1" }), /DESTRUCTIVE_DISABLED/);
});
