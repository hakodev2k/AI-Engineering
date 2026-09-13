import test from "node:test";
import assert from "node:assert/strict";
import { CopperClient, CopperError } from "../src/client.js";
import { requireApproval } from "../src/policy.js";
import { TOOL_SPECS } from "../src/tools.js";
import type { CopperConfig } from "../src/config.js";

const config: CopperConfig = {
  apiKey: "test-token",
  userEmail: "user@example.com",
  baseUrl: "https://api.copper.com/developer_api/v1",
  timeoutMs: 5000,
  maxRetries: 0,
  allowWrites: true,
  allowHighRisk: false
};

test("registers a useful bounded tool set", () => {
  assert.equal(TOOL_SPECS.length, 18);
  assert.equal(new Set(TOOL_SPECS.map(x => x.name)).size, TOOL_SPECS.length);
  assert.ok(TOOL_SPECS.some(x => x.name === "copper.person.search" && x.risk === "READ"));
  assert.ok(TOOL_SPECS.some(x => x.name === "copper.opportunity.create" && x.risk === "WRITE"));
});

test("write policy requires explicit approval", () => {
  assert.throws(() => requireApproval("WRITE", undefined, config), /requires approval/);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", config));
});

test("write policy denies writes when disabled", () => {
  assert.throws(() => requireApproval("WRITE", "approved", { ...config, allowWrites: false }), /disabled/);
});

test("destructive operations are always disabled", () => {
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved-high-risk", { ...config, allowHighRisk: true }), /disabled/);
});

test("client sends Copper credential headers without exposing them in return data", async () => {
  let seenHeaders: Headers | undefined;
  const fakeFetch: typeof fetch = async (_input, init) => {
    seenHeaders = new Headers(init?.headers);
    return new Response(JSON.stringify({ id: 42, name: "Test Person" }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new CopperClient(config, fakeFetch);
  const result = await client.get("people/42") as { id: number };
  assert.equal(result.id, 42);
  assert.equal(seenHeaders?.get("X-PW-AccessToken"), "test-token");
  assert.equal(seenHeaders?.get("X-PW-UserEmail"), "user@example.com");
});

test("client maps provider errors", async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const client = new CopperClient(config, fakeFetch);
  await assert.rejects(() => client.get("people/1"), (error: unknown) => error instanceof CopperError && error.status === 401);
});

test("client preserves Retry-After on throttling", async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ error: "rate limited" }), { status: 429, headers: { "retry-after": "7" } });
  const client = new CopperClient(config, fakeFetch);
  await assert.rejects(() => client.get("people/1"), (error: unknown) => error instanceof CopperError && error.status === 429 && error.retryAfter === 7);
});
