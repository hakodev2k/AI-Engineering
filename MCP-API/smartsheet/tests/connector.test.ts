import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig, officialEndpoint } from "../src/config.js";
import { assertAllowed, createApprovalToken } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";
import { toUpstreamArgs } from "../src/server.js";
import { ALLOWED_UPSTREAM_TOOLS, SmartsheetMcpClient } from "../src/upstream.js";

const baseConfig = {
  apiToken: "test-token",
  region: "us" as const,
  mcpUrl: "https://mcp.smartsheet.com",
  timeoutMs: 1000,
  approvalSecret: "unit-test-approval-secret",
  requireWriteApproval: true
};

test("configuration requires credentials and pins regional official MCP endpoints", () => {
  assert.throws(() => loadConfig({}), /SMARTSHEET_API_TOKEN/);
  const eu = loadConfig({ SMARTSHEET_API_TOKEN: "x", SMARTSHEET_REGION: "eu" });
  assert.equal(eu.mcpUrl, "https://mcp.smartsheet.eu");
  assert.equal(officialEndpoint("au"), "https://mcp.smartsheet.au");
  assert.throws(() => loadConfig({ SMARTSHEET_API_TOKEN: "x", SMARTSHEET_REGION: "invalid" }), /SMARTSHEET_REGION/);
});

test("registry exposes exactly the reviewed provider-scoped surface", () => {
  assert.equal(TOOLS.length, 13);
  assert.equal(TOOL_MAP.get("smartsheet.row.update")?.risk, "HIGH_RISK");
  assert.equal(TOOL_MAP.get("smartsheet.sheet.summary.get")?.risk, "READ");
  assert.ok(TOOLS.every(t => t.name.startsWith("smartsheet.")));
  assert.ok(TOOLS.every(t => ALLOWED_UPSTREAM_TOOLS.has(t.upstream)));
  assert.equal(TOOLS.some(t => t.risk === "DESTRUCTIVE"), false);
});

test("strict validation rejects unsafe or ambiguous calls", () => {
  assert.throws(() => TOOL_MAP.get("smartsheet.sheet.find")!.schema.parse({ sheetId: 1, query: "x", unexpected: true }));
  assert.throws(() => TOOL_MAP.get("smartsheet.sheet.create")!.schema.parse({
    containerId: 1,
    containerType: "WORKSPACE",
    name: "Bad",
    columns: [{ title: "A", type: "TEXT_NUMBER" }]
  }), /primary/i);
  assert.throws(() => TOOL_MAP.get("smartsheet.row.add")!.schema.parse({ sheetId: 1, rows: [] }));
});

test("read arguments map deterministically to documented upstream schemas", () => {
  assert.deepEqual(toUpstreamArgs("smartsheet.sheet.find", {
    sheetId: 123,
    query: "blocked",
    caseSensitive: true,
    limit: 25,
    offset: 50
  }), {
    sheet_id: 123,
    request: { term: "blocked", caseSensitive: true },
    limit: 25,
    offset: 50
  });
  assert.deepEqual(toUpstreamArgs("smartsheet.report.list", { page: 2, pageSize: 50 }), { page: 2, page_size: 50 });
});

test("write operation mapping strips connector approval material", () => {
  const mapped = toUpstreamArgs("smartsheet.comment.add", {
    sheetId: "10",
    discussionId: "20",
    text: "Reviewed",
    approvalToken: "a".repeat(64)
  });
  assert.deepEqual(mapped, { sheet_id: "10", discussion_id: "20", comment: { text: "Reviewed" } });
  assert.equal("approvalToken" in mapped, false);
});

test("write is denied without approval and accepted only for exact payload", () => {
  const args = { sheetId: 1, rows: [{ cells: [{ columnId: 2, value: "Open" }] }] };
  assert.throws(() => assertAllowed("WRITE", "smartsheet.row.add", args, baseConfig), /approval/i);
  const token = createApprovalToken(baseConfig.approvalSecret!, "smartsheet.row.add", args);
  assert.doesNotThrow(() => assertAllowed("WRITE", "smartsheet.row.add", { ...args, approvalToken: token }, baseConfig));
  assert.throws(() => assertAllowed("WRITE", "smartsheet.row.add", { ...args, rows: [{ cells: [{ columnId: 2, value: "Closed" }] }], approvalToken: token }, baseConfig), /approval/i);
});

test("high-risk updates still require approval even if ordinary write approval is disabled", () => {
  const config = { ...baseConfig, requireWriteApproval: false };
  const args = { sheetId: 1, rows: [{ id: 5, cells: [{ columnId: 2, value: "Done" }] }] };
  assert.throws(() => assertAllowed("HIGH_RISK", "smartsheet.row.update", args, config), /approval/i);
});

test("upstream client refuses non-allowlisted MCP tools before network access", async () => {
  const client = new SmartsheetMcpClient(baseConfig);
  await assert.rejects(() => client.call("delete_rows", {}), /not allowlisted/);
});
