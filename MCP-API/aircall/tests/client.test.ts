import test from "node:test";
import assert from "node:assert/strict";
import { AircallClient, AircallError } from "../src/client.js";
import type { Config } from "../src/config.js";

const config: Config = {
  baseUrl: "https://api.aircall.io/v1",
  timeoutMs: 5000,
  maxRetries: 1,
  readOnly: true,
  allowWrite: false,
  allowDestructive: false,
  approvalMode: "required",
  auth: { type: "basic", apiId: "id", apiToken: "token" }
};

test("sends Basic Auth without exposing credentials in URL", async () => {
  let seenUrl = "";
  let auth = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    auth = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ users: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new AircallClient(config, fakeFetch);
  await client.request("GET", "/users", { query: { per_page: 50 } });
  assert.match(auth, /^Basic /);
  assert.equal(seenUrl.includes("token"), false);
  assert.match(seenUrl, /per_page=50/);
});

test("surfaces 401 without retrying into success", async () => {
  let attempts = 0;
  const fakeFetch: typeof fetch = async () => {
    attempts++;
    return new Response("unauthorized", { status: 401 });
  };
  const client = new AircallClient(config, fakeFetch);
  await assert.rejects(() => client.request("GET", "/users"), (e: unknown) => e instanceof AircallError && e.status === 401);
  assert.equal(attempts, 1);
});

test("does not retry unsafe write failures", async () => {
  let attempts = 0;
  const fakeFetch: typeof fetch = async () => {
    attempts++;
    return new Response("temporary", { status: 503 });
  };
  const client = new AircallClient({ ...config, readOnly: false, allowWrite: true }, fakeFetch);
  await assert.rejects(() => client.request("POST", "/webhooks", { body: {}, retrySafe: false }), AircallError);
  assert.equal(attempts, 1);
});
