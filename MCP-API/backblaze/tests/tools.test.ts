import test from "node:test";
import assert from "node:assert/strict";
import { TOOL_SPECS } from "../src/tools.js";

test("tool names are unique and provider scoped", () => {
  const names = TOOL_SPECS.map(t => t.name);
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.length >= 8 && names.length <= 20);
  assert.ok(names.every(name => name.startsWith("backblaze.")));
});

test("destructive and high-risk tools require approval", () => {
  for (const tool of TOOL_SPECS) {
    if (tool.risk === "DESTRUCTIVE" || tool.risk === "HIGH_RISK") {
      assert.equal(tool.approval, "required");
    }
  }
});

test("object list schema enforces bounded page size", () => {
  const spec = TOOL_SPECS.find(t => t.name === "backblaze.object.list")!;
  assert.equal(spec.schema.safeParse({ bucket: "bucket1", maxKeys: 1000 }).success, true);
  assert.equal(spec.schema.safeParse({ bucket: "bucket1", maxKeys: 1001 }).success, false);
});

test("write tools reject ambiguous extra fields", () => {
  const spec = TOOL_SPECS.find(t => t.name === "backblaze.object.create_upload_url")!;
  const result = spec.schema.safeParse({ bucket: "bucket1", key: "a.txt", approved: true, url: "https://evil.example" });
  assert.equal(result.success, false);
});
