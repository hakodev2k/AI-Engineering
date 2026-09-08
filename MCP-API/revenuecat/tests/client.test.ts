import test from "node:test";
import assert from "node:assert/strict";
import { RevenueCatClient, RevenueCatError } from "../src/client/revenuecat.js";
import type { RevenueCatConfig } from "../src/auth/config.js";

const config: RevenueCatConfig = {
  apiKey: "secret_test_key",
  mcpUrl: "https://mcp.revenuecat.ai/mcp",
  apiBaseUrl: "https://api.revenuecat.com/v2",
  timeoutMs: 1000,
  maxRetries: 1,
};

test("REST client isolates bearer credential and parses JSON", async () => {
  const original = globalThis.fetch;
  let seenAuth = "";
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    seenAuth = headers.get("authorization") || "";
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;

  try {
    const client = new RevenueCatClient(config);
    const body = await client.rest<{ ok: boolean }>("GET", "/projects");
    assert.deepEqual(body, { ok: true });
    assert.equal(seenAuth, "Bearer secret_test_key");
  } finally {
    globalThis.fetch = original;
  }
});

test("REST client preserves rate-limit retry-after on terminal 429", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response(JSON.stringify({ message: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
  }) as typeof fetch;

  try {
    const client = new RevenueCatClient(config);
    await assert.rejects(
      () => client.rest("GET", "/projects"),
      (error: unknown) => error instanceof RevenueCatError && error.status === 429 && error.retryAfterMs === 0,
    );
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = original;
  }
});

test("REST client does not retry permission errors", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response(JSON.stringify({ message: "forbidden" }), { status: 403 });
  }) as typeof fetch;

  try {
    const client = new RevenueCatClient(config);
    await assert.rejects(() => client.rest("GET", "/projects"), /403/);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = original;
  }
});
