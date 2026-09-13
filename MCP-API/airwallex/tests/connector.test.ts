import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { enforceRisk } from "../src/policy.js";
import { AirwallexClient, AirwallexError } from "../src/client.js";
import { TOOL_SPECS } from "../src/tools.js";

const baseEnv = { AIRWALLEX_CLIENT_ID: "client", AIRWALLEX_API_KEY: "secret" };

test("config defaults to sandbox and deny write gates", () => {
  const config = loadConfig(baseEnv);
  assert.equal(config.environment, "sandbox");
  assert.equal(config.writeMode, "deny");
  assert.equal(config.highRiskMode, "deny");
});

test("config rejects missing credentials", () => {
  assert.throws(() => loadConfig({}), /AIRWALLEX_CLIENT_ID/);
});

test("high-risk and destructive actions are denied by default", () => {
  const config = loadConfig(baseEnv);
  assert.throws(() => enforceRisk(config, "HIGH_RISK"));
  assert.throws(() => enforceRisk(config, "DESTRUCTIVE"));
  assert.doesNotThrow(() => enforceRisk(config, "READ"));
});

test("registers exactly the documented meaningful tool set", () => {
  assert.equal(TOOL_SPECS.length, 13);
  assert.equal(new Set(TOOL_SPECS.map(x => x.name)).size, 13);
});

test("client reuses authentication token across reads", async () => {
  let authCalls = 0;
  let apiCalls = 0;
  const fakeFetch: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/authentication/login")) {
      authCalls++;
      return new Response(JSON.stringify({ token: "t", expires_at: new Date(Date.now() + 30 * 60_000).toISOString() }), { status: 200 });
    }
    apiCalls++;
    return new Response(JSON.stringify([{ currency: "USD", available_amount: 10 }]), { status: 200 });
  };
  const client = new AirwallexClient(loadConfig(baseEnv), fakeFetch);
  await client.request("GET", "/api/v1/balances/current");
  await client.request("GET", "/api/v1/balances/current");
  assert.equal(authCalls, 1);
  assert.equal(apiCalls, 2);
});

test("non-idempotent writes are not blindly retried", async () => {
  let createCalls = 0;
  const fakeFetch: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/authentication/login")) return new Response(JSON.stringify({ token: "t", expires_at: new Date(Date.now() + 30 * 60_000).toISOString() }), { status: 200 });
    createCalls++;
    return new Response(JSON.stringify({ code: "too_many_requests" }), { status: 429 });
  };
  const client = new AirwallexClient(loadConfig({ ...baseEnv, AIRWALLEX_MAX_RETRIES: "3" }), fakeFetch);
  await assert.rejects(() => client.request("POST", "/api/v1/transfers/create", { body: {} }), AirwallexError);
  assert.equal(createCalls, 1);
});
