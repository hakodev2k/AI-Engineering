import test from "node:test";
import assert from "node:assert/strict";
import { RecurlyClient, RecurlyApiError } from "../src/client.js";
import type { Config } from "../src/config.js";

const cfg: Config = { apiKey:"abc", apiVersion:"2021-02-25", permission:"read", requireWriteApproval:true, requireHighRiskApproval:true, timeoutMs:1000, maxRetries:1 };

test("sends isolated Basic auth and pinned API version to the fixed Recurly host", async () => {
  let seenInput: unknown;
  let seenInit: RequestInit | undefined;
  const fake = async (input: URL | RequestInfo, init?: RequestInit) => { seenInput = input; seenInit = init; return new Response(JSON.stringify({ id:"a" }), { status:200, headers:{"content-type":"application/json"} }); };
  const out = await new RecurlyClient(cfg, fake as typeof fetch).request("GET", "/accounts/a");
  assert.deepEqual(out, { id:"a" });
  assert.equal(String(seenInput), "https://v3.recurly.com/accounts/a");
  const headers = seenInit?.headers as Record<string,string>;
  assert.equal(headers.Authorization, `Basic ${Buffer.from("abc:").toString("base64")}`);
  assert.equal(headers.Accept, "application/vnd.recurly.v2021-02-25");
});

test("retries a throttled GET but not writes", async () => {
  let calls = 0;
  const fake = async () => ++calls === 1 ? new Response(JSON.stringify({message:"slow"}), {status:429, headers:{"retry-after":"0"}}) : new Response(JSON.stringify({ok:true}), {status:200});
  const out = await new RecurlyClient(cfg, fake as typeof fetch).request("GET", "/accounts");
  assert.deepEqual(out, {ok:true});
  assert.equal(calls, 2);

  calls = 0;
  const always429 = async () => { calls++; return new Response(JSON.stringify({message:"slow"}), {status:429}); };
  await assert.rejects(() => new RecurlyClient(cfg, always429 as typeof fetch).request("POST", "/accounts", {code:"x"}), RecurlyApiError);
  assert.equal(calls, 1);
});

test("rejects path traversal", async () => {
  await assert.rejects(() => new RecurlyClient(cfg, fetch).request("GET", "/../evil"), /Invalid Recurly path/);
});
