import test from "node:test";
import assert from "node:assert/strict";
import { TOOL_ROUTES, ROUTE_BY_EXTERNAL } from "../src/tools.js";

test("registers a useful 8-20 tool surface", () => {
  assert.ok(TOOL_ROUTES.length >= 8 && TOOL_ROUTES.length <= 20);
});

test("external names are stable provider-scoped actions", () => {
  for (const route of TOOL_ROUTES) {
    assert.match(route.external, /^aiven\.[a-z0-9_.]+$/);
    assert.equal(ROUTE_BY_EXTERNAL.get(route.external), route);
  }
});

test("no destructive tool is exposed", () => {
  assert.equal(TOOL_ROUTES.some((route) => route.risk === "DESTRUCTIVE"), false);
});

test("writes are explicitly classified", () => {
  assert.equal(ROUTE_BY_EXTERNAL.get("aiven.service.create")?.risk, "WRITE");
  assert.equal(ROUTE_BY_EXTERNAL.get("aiven.service.update")?.risk, "HIGH_RISK");
});
