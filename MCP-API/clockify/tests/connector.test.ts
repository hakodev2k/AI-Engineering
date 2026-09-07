import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { ClockifyApiError, ClockifyClient } from "../src/client.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const baseConfig = { apiKey:"secret", timeoutMs:1000, maxRetries:0, allowWrites:false, allowDestructive:false, approvalToken:undefined };

test("configuration requires API key", () => {
  assert.throws(() => loadConfig({}), /CLOCKIFY_API_KEY/);
  const config = loadConfig({ CLOCKIFY_API_KEY:"abc", CLOCKIFY_MAX_RETRIES:"99" });
  assert.equal(config.maxRetries, 5);
  assert.equal(config.allowWrites, false);
});

test("expected tool surface is registered", () => {
  assert.equal(TOOLS.length, 16);
  assert.ok(TOOL_MAP.has("clockify.workspace.list"));
  assert.ok(TOOL_MAP.has("clockify.report.detailed"));
  assert.ok(TOOL_MAP.has("clockify.time_entry.delete"));
});

test("schemas reject ambiguous identifiers and unknown fields", () => {
  const getProject = TOOL_MAP.get("clockify.project.get")!;
  assert.throws(() => getProject.schema.parse({ workspaceId:"../../x", projectId:"p1" }));
  assert.throws(() => getProject.schema.parse({ workspaceId:"w1", projectId:"p1", url:"https://evil.example" }));
});

test("write and destructive actions require policy and approval", () => {
  assert.throws(() => assertAllowed("WRITE", { approvalToken:"approve-123" }, baseConfig), /disabled/);
  const writeConfig = { ...baseConfig, allowWrites:true, approvalToken:"approve-123" };
  assert.throws(() => assertAllowed("WRITE", { approvalToken:"wrong-token" }, writeConfig), /approval/);
  assert.doesNotThrow(() => assertAllowed("WRITE", { approvalToken:"approve-123" }, writeConfig));
  assert.throws(() => assertAllowed("DESTRUCTIVE", { approvalToken:"approve-123" }, writeConfig), /destructive/);
  assert.doesNotThrow(() => assertAllowed("DESTRUCTIVE", { approvalToken:"approve-123" }, { ...writeConfig, allowDestructive:true }));
});

test("client isolates API key and serializes pagination", async () => {
  let seenUrl = "";
  let seenKey = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenKey = new Headers(init?.headers).get("X-Api-Key") ?? "";
    return new Response(JSON.stringify([{ id:"w1" }]), { status:200, headers:{ "Content-Type":"application/json" } });
  };
  const client = new ClockifyClient(baseConfig, fakeFetch);
  const data = await client.request("/workspaces/w1/projects", { query:{ page:2, "page-size":50 } });
  assert.deepEqual(data, [{ id:"w1" }]);
  assert.equal(seenKey, "secret");
  assert.match(seenUrl, /page=2/);
  assert.match(seenUrl, /page-size=50/);
});

test("client maps provider errors without retrying ordinary 4xx", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response("forbidden", { status:403 }); };
  const client = new ClockifyClient({ ...baseConfig, maxRetries:3 }, fakeFetch);
  await assert.rejects(() => client.request("/workspaces"), (error: unknown) => error instanceof ClockifyApiError && error.status === 403);
  assert.equal(calls, 1);
});

test("429 preserves retry-after once retries are exhausted", async () => {
  const fakeFetch: typeof fetch = async () => new Response("too many", { status:429, headers:{ "retry-after":"7" } });
  const client = new ClockifyClient(baseConfig, fakeFetch);
  await assert.rejects(() => client.request("/workspaces"), (error: unknown) => error instanceof ClockifyApiError && error.retryAfter === "7");
});

test("timeout is surfaced", async () => {
  const fakeFetch: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  });
  const client = new ClockifyClient({ ...baseConfig, timeoutMs:10 }, fakeFetch);
  await assert.rejects(() => client.request("/workspaces"), /timed out/);
});
