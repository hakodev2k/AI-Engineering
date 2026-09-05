import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS } from "../src/tools.js";

test("exposes 8-20 meaningful tools", () => assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20));
test("all tools are provider-scoped and unique", () => {
  const names = new Set<string>();
  for (const tool of TOOLS) { assert.match(tool.name, /^turso\.[a-z0-9_.]+$/); assert.equal(names.has(tool.name), false); names.add(tool.name); }
});
test("no destructive tool is exposed", () => assert.equal(TOOLS.some((t) => t.risk === "DESTRUCTIVE"), false));
test("write tools require approval in schema", () => {
  for (const tool of TOOLS.filter((t) => t.risk !== "READ")) assert.ok((tool.inputSchema.required as string[]).includes("approval"));
});
