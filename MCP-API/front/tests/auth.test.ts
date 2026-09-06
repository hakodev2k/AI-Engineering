import test from "node:test";
import assert from "node:assert/strict";
import { CredentialProvider } from "../src/auth.js";
import { loadConfig } from "../src/config.js";

test("client_credentials token is cached in memory", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async (_input, init) => {
    calls++;
    assert.equal(init?.method, "POST");
    assert.match(String(init?.body), /grant_type=client_credentials/);
    return new Response(JSON.stringify({ access_token:"abc", expires_in:900 }), { status:200, headers:{"content-type":"application/json"} });
  };
  const p = new CredentialProvider(loadConfig({ FRONT_OAUTH_URL:"https://example.frontapp.com/oauth/token", FRONT_CLIENT_ID:"id", FRONT_CLIENT_SECRET:"secret" }), fakeFetch);
  assert.equal(await p.getAccessToken(), "abc");
  assert.equal(await p.getAccessToken(), "abc");
  assert.equal(calls, 1);
});

test("token errors do not leak secret", async () => {
  const secret = "never-log-me";
  const fakeFetch: typeof fetch = async () => new Response("no", { status:401 });
  const p = new CredentialProvider(loadConfig({ FRONT_OAUTH_URL:"https://example.frontapp.com/oauth/token", FRONT_CLIENT_ID:"id", FRONT_CLIENT_SECRET:secret }), fakeFetch);
  await assert.rejects(p.getAccessToken(), e => e instanceof Error && !e.message.includes(secret));
});
