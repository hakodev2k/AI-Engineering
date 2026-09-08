import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("requires both Porkbun credential values", () => {
  assert.throws(() => loadConfig({ PORKBUN_API_KEY: "pk1_demo" }), /required/);
});

test("accepts sandbox-style documented prefixes and safe defaults", () => {
  const cfg = loadConfig({ PORKBUN_API_KEY: "pk1_sb_demo", PORKBUN_SECRET_API_KEY: "sk1_sb_demo" });
  assert.equal(cfg.requireWriteApproval, true);
  assert.equal(cfg.enableDestructive, false);
  assert.equal(cfg.upstreamPackage, "@porkbunllc/mcp-server");
  assert.equal(cfg.maxReadRetries, 2);
});

test("rejects substitution of an unofficial upstream package", () => {
  assert.throws(() => loadConfig({ PORKBUN_API_KEY: "pk1_demo", PORKBUN_SECRET_API_KEY: "sk1_demo", PORKBUN_UPSTREAM_PACKAGE: "evil-server" }), /official/);
});
