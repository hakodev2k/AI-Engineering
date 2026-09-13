import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { GiphyClient, GiphyError } from "../src/client.js";

test("auth config requires API key", () => {
  assert.throws(() => loadConfig({}), /GIPHY_API_KEY/);
});

test("config validates rating", () => {
  assert.throws(() => loadConfig({ GIPHY_API_KEY: "x", GIPHY_DEFAULT_RATING: "bad" }), /rating/i);
});

test("client injects API key and returns JSON", async () => {
  let requested = "";
  const fakeFetch: typeof fetch = async (input) => {
    requested = String(input);
    return new Response(JSON.stringify({ data: [{ id: "1" }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new GiphyClient(loadConfig({ GIPHY_API_KEY: "secret", GIPHY_MAX_RETRIES: "0" }), fakeFetch);
  const result = await client.get("/v1/gifs/search", { q: "cat" });
  assert.equal((result as any).data[0].id, "1");
  assert.match(requested, /q=cat/);
  assert.match(requested, /api_key=secret/);
});

test("client maps authentication failure without retry", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response("invalid key", { status: 401 }); };
  const client = new GiphyClient(loadConfig({ GIPHY_API_KEY: "bad", GIPHY_MAX_RETRIES: "3" }), fakeFetch);
  await assert.rejects(() => client.get("/v1/gifs/search", { q: "cat" }), (e: unknown) => e instanceof GiphyError && e.status === 401);
  assert.equal(calls, 1);
});

test("client retries throttling in bounded fashion", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response("slow down", { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new GiphyClient(loadConfig({ GIPHY_API_KEY: "x", GIPHY_MAX_RETRIES: "1" }), fakeFetch);
  await client.get("/v1/gifs/trending", {});
  assert.equal(calls, 2);
});

test("client converts timeout to provider error", async () => {
  const fakeFetch: typeof fetch = async (_input, init) => await new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }))));
  const client = new GiphyClient(loadConfig({ GIPHY_API_KEY: "x", GIPHY_TIMEOUT_MS: "1", GIPHY_MAX_RETRIES: "0" }), fakeFetch);
  await assert.rejects(() => client.get("/v1/gifs/random", {}), (e: unknown) => e instanceof GiphyError && e.status === 408);
});
