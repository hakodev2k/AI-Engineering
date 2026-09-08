import test from "node:test";
import assert from "node:assert/strict";
import { LobClient, LobApiError } from "../src/client/lob-client.js";
import { loadConfig } from "../src/auth/config.js";

const config = loadConfig({ LOB_API_KEY: "test_abc123", LOB_MAX_RETRIES: "1", LOB_TIMEOUT_MS: "2000" });

test("client uses Basic auth without exposing key in URL", async () => {
  let seenUrl = "";
  let seenAuth = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenAuth = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ id: "adr_123" }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new LobClient(config, fakeFetch);
  const result = await client.request<{ id: string }>("GET", "/addresses/adr_123");
  assert.equal(result.id, "adr_123");
  assert.equal(seenUrl.includes("test_abc123"), false);
  assert.equal(seenAuth, `Basic ${Buffer.from("test_abc123:").toString("base64")}`);
});

test("client retries boundedly on 429 for reads", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response(JSON.stringify({ error: { message: "rate limited" } }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ data: [] }), { status: 200 });
  };
  const client = new LobClient(config, fakeFetch);
  await client.request("GET", "/addresses");
  assert.equal(calls, 2);
});

test("client does not blindly retry non-idempotent writes", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ error: { message: "server error" } }), { status: 500 });
  };
  const client = new LobClient(config, fakeFetch);
  await assert.rejects(() => client.request("POST", "/addresses", { body: { address_line1: "x" } }), LobApiError);
  assert.equal(calls, 1);
});

test("idempotent POST may retry", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async (_input, init) => {
    calls += 1;
    assert.equal(new Headers(init?.headers).get("idempotency-key"), "idem-12345678");
    if (calls === 1) return new Response(JSON.stringify({ error: { message: "temporary" } }), { status: 503 });
    return new Response(JSON.stringify({ id: "psc_123" }), { status: 200 });
  };
  const client = new LobClient(config, fakeFetch);
  const result = await client.request<{ id: string }>("POST", "/postcards", { body: {}, idempotencyKey: "idem-12345678" });
  assert.equal(result.id, "psc_123");
  assert.equal(calls, 2);
});
