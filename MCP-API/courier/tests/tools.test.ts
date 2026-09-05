import test from "node:test";
import assert from "node:assert/strict";
import { ROUTE_BY_EXTERNAL, TOOL_ROUTES } from "../src/tools.js";

test("exposes a curated 8-20 tool surface", () => {
  assert.ok(TOOL_ROUTES.length >= 8 && TOOL_ROUTES.length <= 20);
});

test("tool names are provider-scoped and unique", () => {
  const names = TOOL_ROUTES.map((route) => route.external);
  assert.equal(new Set(names).size, names.length);
  for (const name of names) assert.match(name, /^courier\.[a-z0-9_.]+$/);
});

test("externally visible send is HIGH_RISK", () => {
  assert.equal(ROUTE_BY_EXTERNAL.get("courier.message.send")?.risk, "HIGH_RISK");
  assert.equal(ROUTE_BY_EXTERNAL.get("courier.automation.invoke")?.risk, "HIGH_RISK");
});

test("no destructive upstream tool is exposed", () => {
  assert.equal(TOOL_ROUTES.some((route) => /delete|archive|cancel_message/.test(route.upstream)), false);
});
