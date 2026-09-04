import test from "node:test";
import assert from "node:assert/strict";
import { AircallClient } from "../src/client.js";
import type { Config } from "../src/config.js";
import { toolMap } from "../src/tools.js";

const config: Config = {
  baseUrl: "https://api.aircall.io/v1",
  timeoutMs: 5000,
  maxRetries: 1,
  readOnly: true,
  allowWrite: false,
  allowDestructive: false,
  approvalMode: "required",
  auth: { type: "bearer", accessToken: "test" }
};

test("retries a rate-limited safe read once and preserves bounded retry behavior", async () => {
  let attempts = 0;
  const fakeFetch: typeof fetch = async () => {
    attempts++;
    if (attempts === 1) return new Response("rate limited", { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ users: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new AircallClient(config, fakeFetch);
  const result = await client.request<{ users: unknown[] }>("GET", "/users");
  assert.deepEqual(result.users, []);
  assert.equal(attempts, 2);
});

test("pagination inputs are bounded to Aircall page sizes", () => {
  const parse = toolMap.get("aircall.call.list")!.parse;
  assert.doesNotThrow(() => parse({ page: 2, per_page: 50 }));
  assert.throws(() => parse({ page: 1, per_page: 5000 }));
});
