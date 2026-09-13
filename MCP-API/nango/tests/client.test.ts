import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { NangoClient, NangoError } from "../src/client.js";

const config = loadConfig({ NANGO_SECRET_KEY: "secret", NANGO_MAX_RETRIES: "1", NANGO_TIMEOUT_MS: "100" });

test("client sends bearer auth and provider/connection headers for MCP", async () => {
  let seen: any;
  const fake = async (_url: any, init: any) => { seen = init; return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }); };
  const client = new NangoClient(config, fake as typeof fetch);
  await client.mcp("hubspot-mcp", "c1", { jsonrpc: "2.0" });
  assert.equal(seen.headers.Authorization, "Bearer secret");
  assert.equal(seen.headers["Provider-Config-Key"], "hubspot-mcp");
  assert.equal(seen.headers["Connection-Id"], "c1");
});

test("GET retries one 429 but authentication failures do not retry", async () => {
  let calls = 0;
  const retrying = async () => { calls++; return calls === 1 ? new Response("slow", { status: 429, headers: { "retry-after": "0" } }) : new Response('{"data":[]}', { status: 200 }); };
  await new NangoClient(config, retrying as typeof fetch).listProviders();
  assert.equal(calls, 2);
  calls = 0;
  const authFail = async () => { calls++; return new Response("bad token", { status: 401 }); };
  await assert.rejects(() => new NangoClient(config, authFail as typeof fetch).listProviders(), NangoError);
  assert.equal(calls, 1);
});

test("POST connect session is not blindly retried", async () => {
  let calls = 0;
  const failing = async () => { calls++; return new Response("busy", { status: 503 }); };
  await assert.rejects(() => new NangoClient(config, failing as typeof fetch).createConnectSession({ end_user: { id: "u" } }), NangoError);
  assert.equal(calls, 1);
});
