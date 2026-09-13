import assert from "node:assert/strict";
import test from "node:test";
import { TOOL_SPECS } from "../src/tools.js";

test("tool registry is unique and risk-classified", () => {
  assert.equal(TOOL_SPECS.length, 8);
  assert.equal(new Set(TOOL_SPECS.map(x => x.name)).size, TOOL_SPECS.length);
  assert.equal(TOOL_SPECS.find(x => x.name === "kinde.user.create")?.risk, "WRITE");
  assert.equal(TOOL_SPECS.find(x => x.name === "kinde.user.password_reset.request")?.risk, "HIGH_RISK");
  assert.equal(TOOL_SPECS.find(x => x.name === "kinde.organization.suspension.set")?.risk, "HIGH_RISK");
  assert.equal(TOOL_SPECS.filter(x => x.risk === "READ").length, 5);
});
