import test from "node:test";
import assert from "node:assert/strict";
import { ClerkClient } from "../src/client.js";
import type { Config } from "../src/config.js";

const cfg: Config = { secretKey: "sk_test_secret", apiBaseUrl: "https://api.clerk.com/v1", apiVersion: "2025-04-10", readOnly: true, allowWrite: false, approvalMode: "required", timeoutMs: 1000, maxRetries: 1 };

test("sends bearer auth without returning the secret", async () => {
  let auth = "";
  const fake: typeof fetch = async (_url, init) => {
    auth = new Headers(init?.headers).get("Authorization") ?? "";
    return new Response(JSON.stringify({ id: "user_1" }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new ClerkClient(cfg, fake);
  const result = await client.request<{ id: string }>("GET", "/users/user_1");
  assert.equal(auth, "Bearer sk_test_secret");
  assert.equal(JSON.stringify(result).includes("sk_test_secret"), false);
});

test("does not retry writes", async () => {
  let calls = 0;
  const fake: typeof fetch = async () => { calls++; return new Response("busy", { status: 503 }); };
  const client = new ClerkClient(cfg, fake);
  await assert.rejects(() => client.request("POST", "/invitations", { body: {}, retryable: false }));
  assert.equal(calls, 1);
});
