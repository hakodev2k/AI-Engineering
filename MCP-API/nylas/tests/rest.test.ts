import test from "node:test";
import assert from "node:assert/strict";
import { NylasRestClient, NylasError, type Config } from "../src/index.js";

const cfg: Config = {
  apiKey: "placeholder",
  region: "us",
  defaultGrantId: "grant-example",
  timeoutMs: 1000,
  maxRetries: 1,
  approveWrites: false,
  approveHighRisk: false,
  enableDestructive: false
};

test("GET retries once on 429", async () => {
  let calls = 0;
  const fake = (async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ error: { type: "rate_limit_error", message: "slow" } }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ data: [], next_cursor: "cursor-2" }), { status: 200 });
  }) as typeof fetch;
  const result: any = await new NylasRestClient(cfg, fake).request("GET", "/grants/grant-example/messages");
  assert.equal(calls, 2);
  assert.equal(result.next_cursor, "cursor-2");
});

test("POST is not retried on throttling", async () => {
  let calls = 0;
  const fake = (async () => {
    calls++;
    return new Response(JSON.stringify({ error: { type: "rate_limit_error", message: "slow" } }), { status: 429 });
  }) as typeof fetch;
  await assert.rejects(() => new NylasRestClient(cfg, fake).request("POST", "/grants/grant-example/messages/send", {}), NylasError);
  assert.equal(calls, 1);
});

test("provider errors are mapped", async () => {
  const fake = (async () => new Response(JSON.stringify({ error: { type: "insufficient_scopes", message: "missing permission" } }), { status: 403 })) as typeof fetch;
  await assert.rejects(
    () => new NylasRestClient(cfg, fake).request("GET", "/grants/grant-example/messages"),
    (error: any) => error instanceof NylasError && error.status === 403 && error.type === "insufficient_scopes"
  );
});
