import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { MastodonClient, MastodonError } from "../src/client.js";
import { TOOL_SPECS } from "../src/tools.js";

const base = {
  MASTODON_BASE_URL: "https://mastodon.example",
  MASTODON_ACCESS_TOKEN: "test-token",
  MASTODON_ALLOW_WRITES: "true",
  MASTODON_ALLOW_HIGH_RISK: "true",
  MASTODON_ALLOW_DESTRUCTIVE: "true"
};

test("config validates HTTPS origin and token", () => {
  const cfg = loadConfig(base);
  assert.equal(cfg.baseUrl, "https://mastodon.example");
  assert.throws(() => loadConfig({ ...base, MASTODON_BASE_URL: "http://localhost:3000" }));
  assert.throws(() => loadConfig({ ...base, MASTODON_ACCESS_TOKEN: "" }));
});

test("all tools are provider scoped and risk classified", () => {
  assert.equal(TOOL_SPECS.length, 16);
  for (const [name, risk] of TOOL_SPECS) {
    assert.match(name, /^mastodon\./);
    assert.ok(["READ", "WRITE", "HIGH_RISK", "DESTRUCTIVE"].includes(risk));
  }
});

test("approval policy denies unsafe execution", () => {
  const cfg = loadConfig({ ...base, MASTODON_ALLOW_HIGH_RISK: "false" });
  assert.throws(() => requireApproval("WRITE", undefined, cfg));
  assert.throws(() => requireApproval("HIGH_RISK", "approved-high-risk", cfg));
  assert.doesNotThrow(() => requireApproval("READ", undefined, cfg));
});

test("client maps auth errors and never retries them", async () => {
  let calls = 0;
  const fake = (async () => {
    calls++;
    return new Response(JSON.stringify({ error: "The access token is invalid" }), { status: 401, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  const client = new MastodonClient(loadConfig(base), fake);
  await assert.rejects(() => client.request("GET", "/api/v1/accounts/verify_credentials"), (e: unknown) => e instanceof MastodonError && e.status === 401);
  assert.equal(calls, 1);
});

test("client retries GET throttling and preserves Authorization internally", async () => {
  let calls = 0;
  const fake = (async (_url: string | URL | Request, init?: RequestInit) => {
    calls++;
    assert.equal((init?.headers as Record<string,string>).Authorization, "Bearer test-token");
    if (calls === 1) return new Response(JSON.stringify({ error: "slow down" }), { status: 429, headers: { "retry-after": "0", "content-type": "application/json" } });
    return new Response(JSON.stringify({ id: "1" }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  const client = new MastodonClient(loadConfig({ ...base, MASTODON_MAX_RETRIES: "1" }), fake);
  assert.deepEqual(await client.request("GET", "/api/v1/statuses/1"), { id: "1" });
  assert.equal(calls, 2);
});
