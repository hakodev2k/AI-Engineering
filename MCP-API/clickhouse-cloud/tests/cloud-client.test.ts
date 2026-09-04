import test from "node:test";
import assert from "node:assert/strict";
import { ClickHouseCloudClient, CloudError } from "../src/cloud-client.js";

const cfg: any = { apiKey: "kid", apiSecret: "sec", orgId: "123e4567-e89b-12d3-a456-426614174000", cloudTimeoutMs: 5000 };

test("uses Basic auth and fixed API host", async () => {
  let seen = ""; let auth = "";
  const fake: any = async (url: string, init: any) => { seen = url; auth = init.headers.Authorization; return new Response(JSON.stringify({ result: [] }), { status: 200, headers: { "content-type": "application/json" } }); };
  await new ClickHouseCloudClient(cfg, fake).services();
  assert.match(seen, /^https:\/\/api\.clickhouse\.cloud\/v1\/organizations\//);
  assert.equal(auth, `Basic ${Buffer.from("kid:sec").toString("base64")}`);
});

test("rejects suspicious ids", async () => {
  const fake: any = async () => new Response("{}", { status: 200 });
  await assert.rejects(() => new ClickHouseCloudClient(cfg, fake).service("../secrets"), /Invalid provider resource id/);
});

test("preserves retry-after on 429", async () => {
  const fake: any = async () => new Response("throttled", { status: 429, headers: { "retry-after": "10" } });
  await assert.rejects(() => new ClickHouseCloudClient(cfg, fake).services(), (e: unknown) => e instanceof CloudError && e.status === 429 && e.retryAfter === "10");
});
