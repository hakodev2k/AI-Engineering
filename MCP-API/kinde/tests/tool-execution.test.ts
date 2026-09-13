import assert from "node:assert/strict";
import test from "node:test";
import type { KindeConfig } from "../src/config.js";
import { KindeClient } from "../src/client.js";
import { executeTool, TOOL_SPECS } from "../src/tools.js";

const base: KindeConfig = {
  domain: "https://tenant.kinde.com", clientId: "client", clientSecret: "secret",
  audience: "https://tenant.kinde.com/api", scopes: "read:users create:users",
  timeoutMs: 1000, maxRetries: 0, allowWrites: false, allowHighRisk: false
};

function spec(name: string) {
  const found = TOOL_SPECS.find(x => x.name === name);
  if (!found) throw new Error(`missing spec ${name}`);
  return found;
}

test("write tool is denied before provider call when disabled", async () => {
  let calls = 0;
  const client = new KindeClient(base, (async () => { calls++; return new Response(); }) as typeof fetch);
  await assert.rejects(() => executeTool(spec("kinde.user.create"), { email: "a@example.com", approval: "approved" }, client, base), /Write tools are disabled/);
  assert.equal(calls, 0);
});

test("approved user create uses documented endpoint and body", async () => {
  const requests: { url: string; method?: string; body?: string }[] = [];
  const fakeFetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, method: init?.method, body: typeof init?.body === "string" ? init.body : undefined });
    if (url.endsWith("/oauth2/token")) return new Response(JSON.stringify({ access_token: "token", expires_in: 3600 }), { status: 200 });
    return new Response(JSON.stringify({ id: "kp_new" }), { status: 201 });
  }) as typeof fetch;
  const config = { ...base, allowWrites: true };
  const client = new KindeClient(config, fakeFetch);
  const result = await executeTool(spec("kinde.user.create"), { email: "a@example.com", given_name: "Ada", approval: "approved" }, client, config);
  assert.deepEqual(result, { id: "kp_new" });
  assert.equal(requests[1]?.url, "https://tenant.kinde.com/api/v1/user");
  assert.equal(requests[1]?.method, "POST");
  assert.match(requests[1]?.body ?? "", /"type":"email"/);
});
