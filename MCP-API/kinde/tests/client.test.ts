import assert from "node:assert/strict";
import test from "node:test";
import type { KindeConfig } from "../src/config.js";
import { KindeClient, sanitizeProviderData } from "../src/client.js";

const config: KindeConfig = {
  domain: "https://tenant.kinde.com", clientId: "client", clientSecret: "secret",
  audience: "https://tenant.kinde.com/api", scopes: "read:users",
  timeoutMs: 1000, maxRetries: 0, allowWrites: false, allowHighRisk: false
};

test("client obtains M2M token and calls configured Kinde origin", async () => {
  const calls: string[] = [];
  const fakeFetch = (async (input: URL | RequestInfo) => {
    const url = String(input);
    calls.push(url);
    if (url.endsWith("/oauth2/token")) return new Response(JSON.stringify({ access_token: "provider-token", expires_in: 3600 }), { status: 200 });
    return new Response(JSON.stringify({ users: [{ id: "kp_1", access_token: "leak" }] }), { status: 200 });
  }) as typeof fetch;
  const client = new KindeClient(config, fakeFetch);
  const value = await client.request<Record<string, unknown>>("/users", { query: { page_size: 25 } });
  assert.equal(calls[0], "https://tenant.kinde.com/oauth2/token");
  assert.equal(calls[1], "https://tenant.kinde.com/api/v1/users?page_size=25");
  assert.deepEqual(sanitizeProviderData(value), { users: [{ id: "kp_1", access_token: "[REDACTED]" }] });
});

test("client refuses non-root internal paths", async () => {
  const client = new KindeClient(config, (async () => new Response()) as typeof fetch);
  await assert.rejects(() => client.request("https://evil.example"), /must start/);
});
