import test from "node:test";
import assert from "node:assert/strict";
import { PorkbunUpstream } from "../src/upstream.js";

test("rejects non-allowlisted upstream tool before spawning a process", async () => {
  const upstream = new PorkbunUpstream({
    upstreamCommand: "npx",
    upstreamPackage: "@porkbunllc/mcp-server",
    apiKey: "pk1_demo",
    secretApiKey: "sk1_demo",
    timeoutMs: 1000,
    maxReadRetries: 0
  });
  await assert.rejects(() => upstream.call("register_domain", { domain: "example.com" }, { readOnly: false }), /UPSTREAM_TOOL_DENIED/);
});
