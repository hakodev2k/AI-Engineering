import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { OpenMeteoClient, OpenMeteoError } from "../src/client.js";
import { DateRangeQuery, ForecastQuery, SearchQuery } from "../src/schemas.js";

test("config defaults require no secret", () => {
  const c = loadConfig({});
  assert.equal(c.timeoutMs, 10000);
  assert.equal(c.maxRetries, 2);
  assert.equal(c.apiKey, undefined);
});

test("schemas reject unsafe coordinates and cap geocoding count", () => {
  assert.equal(ForecastQuery.safeParse({ latitude: 91, longitude: 0 }).success, false);
  assert.equal(SearchQuery.safeParse({ name: "Berlin", count: 21 }).success, false);
  assert.equal(DateRangeQuery.safeParse({ latitude: 10, longitude: 20, startDate: "bad", endDate: "2026-01-01" }).success, false);
});

test("client builds encoded query and returns JSON", async () => {
  let seen = "";
  const fakeFetch: typeof fetch = async (input) => {
    seen = String(input);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new OpenMeteoClient({ timeoutMs: 1000, maxRetries: 0 }, fakeFetch);
  const result = await client.get("https://example.test", "/v1/search", { name: "Ho Chi Minh City", count: 5 });
  assert.deepEqual(result, { ok: true });
  assert.match(seen, /Ho\+Chi\+Minh\+City/);
});

test("client exposes provider errors without retrying validation/auth failures", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ reason: "invalid latitude" }), { status: 400, headers: { "content-type": "application/json" } });
  };
  const client = new OpenMeteoClient({ timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(() => client.get("https://example.test", "/v1/forecast", {}), (e: unknown) => e instanceof OpenMeteoError && e.status === 400);
  assert.equal(calls, 1);
});

test("client retries throttling with bounded attempts", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ reason: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const client = new OpenMeteoClient({ timeoutMs: 1000, maxRetries: 1 }, fakeFetch);
  assert.deepEqual(await client.get("https://example.test", "/v1/forecast", {}), { ok: true });
  assert.equal(calls, 2);
});
