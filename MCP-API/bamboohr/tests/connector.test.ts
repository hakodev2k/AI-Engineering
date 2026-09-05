import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { approvalFingerprint, assertAllowed } from "../src/policy.js";
import { TOOL_MAPPINGS } from "../src/tools.js";
import { validateAgainstSchema } from "../src/validator.js";

const env = {
  BAMBOOHR_SUBDOMAIN: "acme-test",
  BAMBOOHR_MCP_ACCESS_TOKEN: "test-token",
  BAMBOOHR_REQUIRE_WRITE_APPROVAL: "true"
} as NodeJS.ProcessEnv;

test("config constructs only official tenant endpoint", () => {
  const c = loadConfig(env);
  assert.equal(c.endpoint, "https://acme-test.bamboohr.com/api/mcp");
  assert.equal(c.requireWriteApproval, true);
});

test("invalid subdomain is rejected", () => {
  assert.throws(() => loadConfig({ ...env, BAMBOOHR_SUBDOMAIN: "evil.example/path" }), /invalid characters/);
});

test("connector exposes a bounded provider-scoped surface", () => {
  assert.ok(TOOL_MAPPINGS.length >= 8 && TOOL_MAPPINGS.length <= 20);
  assert.equal(new Set(TOOL_MAPPINGS.map(t => t.external)).size, TOOL_MAPPINGS.length);
  TOOL_MAPPINGS.forEach(t => assert.match(t.external, /^bamboohr\./));
});

test("no high-risk or destructive tool is exposed", () => {
  assert.equal(TOOL_MAPPINGS.some(t => t.risk === "HIGH_RISK" || t.risk === "DESTRUCTIVE"), false);
});

test("write requires exact human approval", () => {
  const args = { employeeId: "42", start: "2026-09-10", end: "2026-09-12" };
  const fp = approvalFingerprint("bamboohr.time_off.request.create", args);
  assert.throws(() => assertAllowed("WRITE", "bamboohr.time_off.request.create", args, { requireWriteApproval: true, approvedActions: new Set() }), /Human approval required/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "bamboohr.time_off.request.create", args, { requireWriteApproval: true, approvedActions: new Set([fp]) }));
});

test("read does not require approval", () => {
  assert.doesNotThrow(() => assertAllowed("READ", "bamboohr.employee.get", {}, { requireWriteApproval: true, approvedActions: new Set() }));
});

test("validator enforces required keys and rejects unknown keys", () => {
  const schema = { type: "object", additionalProperties: false, required: ["employeeId"], properties: { employeeId: { type: "string", minLength: 1 } } };
  assert.doesNotThrow(() => validateAgainstSchema(schema, { employeeId: "42" }));
  assert.throws(() => validateAgainstSchema(schema, {}), /required property missing/);
  assert.throws(() => validateAgainstSchema(schema, { employeeId: "42", token: "leak" }), /unknown property/);
});
