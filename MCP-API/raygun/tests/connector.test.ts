import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type Config } from "../src/config.js";
import { TOOL_BINDINGS } from "../src/catalog.js";
import { addApprovalToSchema, assertAllowed, stripConnectorFields } from "../src/policy.js";

const baseConfig: Config = {
  pat:"secret-not-real",
  mcpUrl:"https://api.raygun.com/v3/mcp",
  maxPermission:"write",
  requireWriteApproval:true,
  requireHighRiskApproval:true,
  enableDestructive:false,
  timeoutMs:20000
};

test("configuration requires a credential", () => {
  assert.throws(() => loadConfig({}), /RAYGUN_PAT is required/);
});

test("configuration rejects non-official MCP endpoints to prevent credential SSRF", () => {
  assert.throws(() => loadConfig({ RAYGUN_PAT:"x", RAYGUN_MCP_URL:"https://evil.example/mcp" }), /official/);
});

test("catalog exposes only provider-scoped stable names", () => {
  assert.equal(TOOL_BINDINGS.length, 24);
  assert.ok(TOOL_BINDINGS.every(tool => tool.publicName.startsWith("raygun.")));
  assert.equal(new Set(TOOL_BINDINGS.map(tool => tool.publicName)).size, TOOL_BINDINGS.length);
  assert.equal(new Set(TOOL_BINDINGS.map(tool => tool.upstreamName)).size, TOOL_BINDINGS.length);
});

test("read tools execute under write ceiling without approval", () => {
  const tool = TOOL_BINDINGS.find(x => x.publicName === "raygun.error_group.search")!;
  assert.doesNotThrow(() => assertAllowed(tool, {}, baseConfig));
});

test("write tools require explicit approval", () => {
  const tool = TOOL_BINDINGS.find(x => x.publicName === "raygun.deployment.create")!;
  assert.throws(() => assertAllowed(tool, {}, baseConfig), /APPROVE_WRITE/);
  assert.doesNotThrow(() => assertAllowed(tool, { approval:"APPROVE_WRITE" }, baseConfig));
});

test("permission ceiling blocks writes even with approval", () => {
  const tool = TOOL_BINDINGS.find(x => x.publicName === "raygun.error_group.comment.add")!;
  assert.throws(() => assertAllowed(tool, { approval:"APPROVE_WRITE" }, { ...baseConfig, maxPermission:"read" }), /Permission denied/);
});

test("approval is connector-local and is never forwarded upstream", () => {
  assert.deepEqual(stripConnectorFields({ approval:"APPROVE_WRITE", applicationId:"app" }), { applicationId:"app" });
});

test("write schemas are augmented with a strict approval field", () => {
  const tool = TOOL_BINDINGS.find(x => x.publicName === "raygun.deployment.create")!;
  const schema = addApprovalToSchema({ type:"object", properties:{ applicationId:{ type:"string" } }, required:["applicationId"] }, tool);
  assert.deepEqual((schema.properties as any).approval.enum, ["APPROVE_WRITE"]);
  assert.ok((schema.required as string[]).includes("approval"));
});
