import test from "node:test";
import assert from "node:assert/strict";
import { TOOL_MAP, authorize, approvalDigest } from "../src/policy.js";

test("connector exposes 13 fixed provider-scoped tools", () => {
  const names = Object.keys(TOOL_MAP);
  assert.equal(names.length, 13);
  assert.equal(new Set(names).size, names.length);
  for (const name of names) assert.match(name, /^firebase\./);
});

test("read tools do not require approval", () => {
  const config = { approvalSecret: "", destructiveEnabled: false };
  assert.doesNotThrow(() => authorize(config, "firebase.project.get", {}));
});

test("write approval is payload-bound", () => {
  const config = { approvalSecret: "approval-secret", destructiveEnabled: false };
  const tool = "firebase.firestore.document.create";
  const payload = { collection: "notes", data: { title: "a" } };
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => authorize(config, tool, payload, token));
  assert.throws(() => authorize(config, tool, { ...payload, collection: "other" }, token), /Invalid approval_token/);
});

test("destructive operations are disabled by default", () => {
  const config = { approvalSecret: "approval-secret", destructiveEnabled: false };
  assert.throws(() => authorize(config, "firebase.firestore.document.delete", { path: "notes/1" }, "0".repeat(64)), /disabled/);
});

test("remote config publish is high risk", () => {
  assert.equal(TOOL_MAP["firebase.remote_config.template.update"].risk, "HIGH_RISK");
});
