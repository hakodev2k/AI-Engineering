import test from "node:test";
import assert from "node:assert/strict";
import { approvalDigest, loadConfig } from "../src/config.js";
import { authorize, TOOL_MAP, getBlockedUpstreamTools } from "../src/policy.js";
import { externalSchemaFromUpstream, validatorFor, validateOrThrow } from "../src/schema.js";

test("provider-facing external tool names are stable and Railway-scoped", () => {
  const names = Object.keys(TOOL_MAP);
  assert.equal(names.length, 14);
  assert.ok(names.every((name) => name.startsWith("railway.")));
  assert.equal(new Set(names).size, names.length);
});

test("known destructive upstream tools are never mapped", () => {
  const mapped = new Set(Object.values(TOOL_MAP).map((x) => x.upstream));
  for (const blocked of getBlockedUpstreamTools()) assert.equal(mapped.has(blocked), false);
});

test("config rejects unsafe CLI command strings", () => {
  assert.throws(
    () => loadConfig({ RAILWAY_CLI_PATH: "railway; rm -rf /" }),
    /unsupported characters/
  );
});

test("read tools execute without approval", () => {
  const config = { approvalSecret: "", enableHighRisk: false, enableDestructive: false };
  assert.doesNotThrow(() => authorize(config, "railway.project.list", {}, undefined));
});

test("write approval is bound to exact payload", () => {
  const config = { approvalSecret: "human-secret", enableHighRisk: false, enableDestructive: false };
  const tool = "railway.project.create";
  const payload = { name: "demo" };
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => authorize(config, tool, payload, token));
  assert.throws(() => authorize(config, tool, { name: "other" }, token), /Invalid approval_token/);
});

test("high-risk operations are disabled by default", () => {
  const config = { approvalSecret: "human-secret", enableHighRisk: false, enableDestructive: false };
  assert.throws(
    () => authorize(config, "railway.deployment.deploy", {}, "0".repeat(64)),
    /RAILWAY_ENABLE_HIGH_RISK/
  );
});

test("upstream schema is tightened and approval token is injected only for approved tools", () => {
  const upstream = {
    type: "object",
    properties: { name: { type: "string", minLength: 1 } },
    required: ["name"]
  };
  const schema = externalSchemaFromUpstream(upstream, true);
  assert.equal(schema.additionalProperties, false);
  assert.ok(schema.required.includes("approval_token"));
  const validate = validatorFor(schema);
  validateOrThrow(validate, { name: "demo", approval_token: "a".repeat(64) });
  assert.throws(
    () => validateOrThrow(validate, { name: "demo", approval_token: "a".repeat(64), extra: true }),
    /Invalid tool input/
  );
});
