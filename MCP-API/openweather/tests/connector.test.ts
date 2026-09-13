import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { AirHistoryQuery, LocationQuery, WeatherQuery } from "../src/schemas.js";
import { OpenWeatherClient, OpenWeatherError } from "../src/client.js";

test("auth configuration requires API key", () => {
  assert.throws(() => loadConfig({}), /OPENWEATHER_API_KEY/);
  assert.equal(loadConfig({ OPENWEATHER_API_KEY: "secret" }).apiKey, "secret");
});

test("schemas reject unsafe or ambiguous inputs", () => {
  assert.equal(LocationQuery.parse({ query: "Hanoi", limit: 3 }).limit, 3);
  assert.throws(() => WeatherQuery.parse({ lat: 91, lon: 0 }));
  assert.throws(() => AirHistoryQuery.parse({ lat: 0, lon: 0, start: 20, end: 10 }));
});

test("client authenticates internally and returns JSON", async () => {
  let requested = "";
  const fakeFetch: typeof fetch = async (input) => {
    requested = String(input);
    return new Response(JSON.stringify({ weather: [{ main: "Clear" }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new OpenWeatherClient({ apiKey: "hidden", timeoutMs: 100, maxRetries: 0, baseUrl: "https://api.openweathermap.org", geoBaseUrl: "https://api.openweathermap.org/geo/1.0" }, fakeFetch);
  const result = await client.get<{ weather: unknown[] }>("/data/2.5/weather", { lat: 1, lon: 2 });
  assert.equal(result.weather.length, 1);
  assert.match(requested, /appid=hidden/);
});

test("client maps permission/auth errors without retry", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response("unauthorized", { status: 401 }); };
  const client = new OpenWeatherClient({ apiKey: "bad", timeoutMs: 100, maxRetries: 3, baseUrl: "https://api.openweathermap.org", geoBaseUrl: "https://api.openweathermap.org/geo/1.0" }, fakeFetch);
  await assert.rejects(client.get("/data/2.5/weather", { lat: 0, lon: 0 }), (e: unknown) => e instanceof OpenWeatherError && e.status === 401);
  assert.equal(calls, 1);
});

test("client retries throttling and preserves retry-after semantics", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response("limited", { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const client = new OpenWeatherClient({ apiKey: "x", timeoutMs: 100, maxRetries: 1, baseUrl: "https://api.openweathermap.org", geoBaseUrl: "https://api.openweathermap.org/geo/1.0" }, fakeFetch);
  assert.deepEqual(await client.get("/data/2.5/weather", { lat: 0, lon: 0 }), { ok: true });
  assert.equal(calls, 2);
});
