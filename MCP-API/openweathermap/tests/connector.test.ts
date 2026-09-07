import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { OpenWeatherApiError, OpenWeatherClient } from "../src/client.js";
import { TOOLS, TOOL_MAP } from "../src/tools.js";

test("configuration requires an API key and pins the official host", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /OPENWEATHER_API_KEY/);
  assert.throws(() => loadConfig({ OPENWEATHER_API_KEY: "x", OPENWEATHER_BASE_URL: "https://evil.example" } as NodeJS.ProcessEnv), /SSRF/);
  const c = loadConfig({ OPENWEATHER_API_KEY: "x" } as NodeJS.ProcessEnv);
  assert.equal(c.baseUrl, "https://api.openweathermap.org");
  assert.equal(c.maxRetries, 3);
});

test("registers eight read-only provider-scoped tools", () => {
  assert.equal(TOOLS.length, 8);
  assert.ok(TOOLS.every(t => t.name.startsWith("openweathermap.") && t.risk === "READ"));
});

test("strict validation rejects invalid coordinates and unknown fields", () => {
  assert.throws(() => TOOL_MAP.get("openweathermap.weather.current")!.schema.parse({ lat: 91, lon: 0 }));
  assert.throws(() => TOOL_MAP.get("openweathermap.weather.current")!.schema.parse({ lat: 1, lon: 2, surprise: true }));
});

test("client isolates API key and adds it only to provider request", async () => {
  let seen = "";
  const fakeFetch: typeof fetch = (async (input: RequestInfo | URL) => {
    seen = String(input);
    return new Response(JSON.stringify({ temp: 20 }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  const client = new OpenWeatherClient(loadConfig({ OPENWEATHER_API_KEY: "secret" } as NodeJS.ProcessEnv), fakeFetch);
  const out = await client.get("/data/2.5/weather", { lat: 1, lon: 2 });
  assert.match(seen, /appid=secret/);
  assert.equal((out as any).source, "untrusted_provider_data");
});

test("maps rate-limit responses and preserves retry-after", async () => {
  const fakeFetch: typeof fetch = (async () => new Response(JSON.stringify({ message: "limit" }), { status: 429, headers: { "retry-after": "2" } })) as typeof fetch;
  const cfg = loadConfig({ OPENWEATHER_API_KEY: "x", OPENWEATHER_MAX_RETRIES: "0" } as NodeJS.ProcessEnv);
  const client = new OpenWeatherClient(cfg, fakeFetch);
  await assert.rejects(client.get("/data/2.5/weather"), (e: unknown) => e instanceof OpenWeatherApiError && e.status === 429 && e.retryAfter === "2");
});

test("passes pagination limit for geocoding-style calls", async () => {
  let seen = "";
  const fakeFetch: typeof fetch = (async (input: RequestInfo | URL) => { seen = String(input); return new Response("[]", { status: 200 }); }) as typeof fetch;
  const client = new OpenWeatherClient(loadConfig({ OPENWEATHER_API_KEY: "x" } as NodeJS.ProcessEnv), fakeFetch);
  await client.get("/geo/1.0/direct", { q: "London", limit: 5 });
  assert.match(seen, /limit=5/);
});
