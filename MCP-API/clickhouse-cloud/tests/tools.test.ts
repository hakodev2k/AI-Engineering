import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, TOOL_MAP } from "../src/tools.js";

test("exposes 8-20 curated tools", () => assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20));
test("all tools are provider scoped", () => TOOLS.forEach(t => assert.match(t.name, /^clickhouse\./)));
test("only expected transports are used", () => TOOLS.forEach(t => assert.ok(t.transport === "mcp" || t.transport === "rest")));
test("no destructive or generic request tool exists", () => {
  assert.equal(TOOLS.some(t => /delete|drop|execute_any|raw_request/.test(t.name)), false);
  assert.equal(TOOL_MAP.get("clickhouse.query.run_readonly")?.upstream, "run_query");
});
