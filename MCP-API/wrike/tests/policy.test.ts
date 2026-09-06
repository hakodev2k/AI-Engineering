import test from "node:test";
import assert from "node:assert/strict";
import { authorize, POLICIES, BY_EXTERNAL, BY_UPSTREAM } from "../src/policy.js";
import type { Config } from "../src/config.js";

const config = (risks: ("READ" | "WRITE")[] = ["READ"], approvalToken = "human-approved"): Config => ({
  mcpUrl: "https://mcp.wrike.com/v2",
  accessToken: "test-token-never-sent",
  allowedRisks: new Set(risks),
  approvalToken,
  timeoutMs: 1000,
  maxInputBytes: 4096
});

test("registers exactly the 17 documented Wrike MCP v2 tools", () => {
  assert.equal(POLICIES.length, 17);
  assert.equal(BY_EXTERNAL.size, 17);
  assert.equal(BY_UPSTREAM.size, 17);
  assert.equal(BY_UPSTREAM.get("search_items")?.external, "wrike.item.search");
  assert.equal(BY_UPSTREAM.get("create_item_comment")?.risk, "WRITE");
});

test("READ tool executes without approval and strips no provider credentials into args", () => {
  const policy = BY_EXTERNAL.get("wrike.item.search")!;
  assert.deepEqual(authorize(policy, { query: "launch" }, config()), { query: "launch" });
});

test("WRITE tool is denied when WRITE permission is disabled", () => {
  const policy = BY_EXTERNAL.get("wrike.task.create")!;
  assert.throws(() => authorize(policy, { approvalToken: "human-approved" }, config(["READ"])), /WRITE operations are disabled/);
});

test("WRITE tool requires matching human approval token and never forwards it upstream", () => {
  const policy = BY_EXTERNAL.get("wrike.task.create")!;
  const enabled = config(["READ", "WRITE"]);
  assert.throws(() => authorize(policy, { title: "x" }, enabled), /human approval/);
  assert.throws(() => authorize(policy, { title: "x", approvalToken: "wrong" }, enabled), /human approval/);
  assert.deepEqual(authorize(policy, { title: "x", approvalToken: "human-approved" }, enabled), { title: "x" });
});

test("oversized input is rejected before upstream execution", () => {
  const policy = BY_EXTERNAL.get("wrike.item.search")!;
  const tiny = { ...config(), maxInputBytes: 16 };
  assert.throws(() => authorize(policy, { query: "a".repeat(100) }, tiny), /exceeds/);
});
