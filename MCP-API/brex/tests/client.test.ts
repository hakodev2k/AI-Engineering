import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { BrexApiError, BrexClient } from "../src/client.js";

const baseConfig = {
  accessToken: "test-token",
  apiBaseUrl: "https://api.brex.com",
  timeoutMs: 1000,
  maxRetries: 0,
  defaultPageSize: 50
};

test("loadConfig requires token and HTTPS base URL", () => {
  assert.throws(() => loadConfig({}), /BREX_ACCESS_TOKEN/);
  assert.throws(() => loadConfig({ BREX_ACCESS_TOKEN: "x", BREX_API_BASE_URL: "http://api.brex.com" }), /HTTPS/);
});

test("list users sends bearer auth and validated query", async () => {
  const calls: string[] = [];
  const fakeFetch = async (input: string | URL | Request, init?: RequestInit) => {
    calls.push(String(input));
    assert.equal((init?.headers as Record<string, string>).authorization, "Bearer test-token");
    return new Response(JSON.stringify({ items: [{ id: "u1" }], next_cursor: null }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new BrexClient(baseConfig, fakeFetch as typeof fetch);
  const result = await client.listUsers({ limit: 10, email: "dev@example.com" });
  assert.equal(result.items.length, 1);
  assert.match(calls[0]!, /\/v2\/users/);
  assert.match(calls[0]!, /limit=10/);
  assert.match(calls[0]!, /email=dev%40example.com/);
});

test("API errors preserve status and Brex trace id", async () => {
  const fakeFetch = async () => new Response("forbidden", { status: 403, headers: { "x-brex-trace-id": "trace-123" } });
  const client = new BrexClient(baseConfig, fakeFetch as typeof fetch);
  await assert.rejects(() => client.getUser("u1"), (error: unknown) => {
    assert.ok(error instanceof BrexApiError);
    assert.equal(error.status, 403);
    assert.equal(error.traceId, "trace-123");
    return true;
  });
});

test("pagination cursor is forwarded without auto-draining pages", async () => {
  let seen = "";
  const fakeFetch = async (input: string | URL | Request) => {
    seen = String(input);
    return new Response(JSON.stringify({ items: [], next_cursor: "next" }), { status: 200 });
  };
  const client = new BrexClient(baseConfig, fakeFetch as typeof fetch);
  const result = await client.listCashAccounts({ cursor: "cursor-1", limit: 25 });
  assert.equal(result.next_cursor, "next");
  assert.match(seen, /cursor=cursor-1/);
});
