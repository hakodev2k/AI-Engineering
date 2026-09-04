import test from "node:test";
import assert from "node:assert/strict";
import { LoopsClient, LoopsApiError } from "../src/client.js";

const cfg = { apiKey: "secret", baseUrl: "https://app.loops.so/api", allowWrite: false, allowDestructive: false, approvalMode: "required" as const, timeoutMs: 1000, maxReadRetries: 0 };

test("adds bearer auth without returning the token", async () => {
  let auth = "";
  const fake = async (_url: URL | RequestInfo, init?: RequestInit) => {
    auth = String((init?.headers as Record<string,string>).Authorization);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new LoopsClient(cfg, fake as typeof fetch);
  const result = await client.request<{ok:boolean}>("/v1/lists");
  assert.equal(result.ok, true);
  assert.equal(auth, "Bearer secret");
  assert.equal(JSON.stringify(result).includes("secret"), false);
});

test("maps provider errors", async () => {
  const fake = async () => new Response(JSON.stringify({ message: "slow down" }), { status: 429, headers: { "retry-after": "1" } });
  const client = new LoopsClient(cfg, fake as typeof fetch);
  await assert.rejects(() => client.request("/v1/lists"), (e: unknown) => e instanceof LoopsApiError && e.status === 429 && e.retryAfter === "1");
});
