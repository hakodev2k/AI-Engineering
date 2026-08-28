import test from "node:test";
import assert from "node:assert/strict";
import { DatabricksTokenProvider } from "../src/auth/token-provider.js";
import { DatabricksClient } from "../src/client/databricks-client.js";

const oauthConfig = {
  host: "https://example.cloud.databricks.com",
  authMode: "oauth_m2m",
  clientId: "client-id",
  clientSecret: "client-secret",
  token: "",
  timeoutMs: 1000,
  maxRetries: 1
};

test("OAuth client credentials token is cached and uses all-apis scope", async () => {
  let calls = 0;
  let observed;
  const fakeFetch = async (url, init) => {
    calls++;
    observed = { url: String(url), init };
    return new Response(JSON.stringify({ access_token: "oauth-token", expires_in: 3600 }), { status: 200 });
  };
  const provider = new DatabricksTokenProvider(oauthConfig, fakeFetch);
  assert.equal(await provider.getAccessToken(), "oauth-token");
  assert.equal(await provider.getAccessToken(), "oauth-token");
  assert.equal(calls, 1);
  assert.equal(observed.url, "https://example.cloud.databricks.com/oidc/v1/token");
  assert.match(String(observed.init.body), /grant_type=client_credentials/);
  assert.match(String(observed.init.body), /scope=all-apis/);
  assert.match(observed.init.headers.Authorization, /^Basic /);
});

test("client applies bearer token and pagination to reads", async () => {
  let observed;
  const tokenProvider = { getAccessToken: async () => "token", invalidate() {} };
  const fakeFetch = async (url, init) => {
    observed = { url: String(url), init };
    return new Response(JSON.stringify({ clusters: [], next_page_token: "next" }), { status: 200 });
  };
  const client = new DatabricksClient({ ...oauthConfig, maxRetries: 0 }, { fetchImpl: fakeFetch, tokenProvider });
  const result = await client.listClusters({ page_size: 20, page_token: "p1" });
  assert.equal(result.next_page_token, "next");
  assert.match(observed.url, /page_size=20/);
  assert.match(observed.url, /page_token=p1/);
  assert.equal(observed.init.headers.Authorization, "Bearer token");
});

test("safe read retries one rate-limit response", async () => {
  let calls = 0;
  const tokenProvider = { getAccessToken: async () => "token", invalidate() {} };
  const fakeFetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ message: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ jobs: [] }), { status: 200 });
  };
  const client = new DatabricksClient(oauthConfig, { fetchImpl: fakeFetch, tokenProvider });
  await client.listJobs({ limit: 20 });
  assert.equal(calls, 2);
});

test("non-idempotent cluster start is not blindly retried", async () => {
  let calls = 0;
  const tokenProvider = { getAccessToken: async () => "token", invalidate() {} };
  const fakeFetch = async () => {
    calls++;
    return new Response(JSON.stringify({ message: "unavailable" }), { status: 503 });
  };
  const client = new DatabricksClient({ ...oauthConfig, maxRetries: 3 }, { fetchImpl: fakeFetch, tokenProvider });
  await assert.rejects(client.startCluster({ cluster_id: "abc" }));
  assert.equal(calls, 1);
});

test("job run-now can retry only when an idempotency token is supplied", async () => {
  const tokenProvider = { getAccessToken: async () => "token", invalidate() {} };
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ message: "temporary" }), { status: 503 });
    return new Response(JSON.stringify({ run_id: 123 }), { status: 200 });
  };
  const client = new DatabricksClient({ ...oauthConfig, maxRetries: 1 }, { fetchImpl: fakeFetch, tokenProvider });
  const result = await client.runJob({ job_id: 7, idempotency_token: "run-7-unique" });
  assert.equal(result.run_id, 123);
  assert.equal(calls, 2);
});

test("OAuth 401 invalidates cached token and retries authentication once", async () => {
  let fetchCalls = 0;
  let invalidations = 0;
  let tokenCalls = 0;
  const tokenProvider = {
    async getAccessToken() { tokenCalls++; return tokenCalls === 1 ? "old" : "new"; },
    invalidate() { invalidations++; }
  };
  const fakeFetch = async (_url, init) => {
    fetchCalls++;
    if (init.headers.Authorization === "Bearer old") return new Response(JSON.stringify({ message: "expired" }), { status: 401 });
    return new Response(JSON.stringify({ state: "RUNNING" }), { status: 200 });
  };
  const client = new DatabricksClient({ ...oauthConfig, maxRetries: 0 }, { fetchImpl: fakeFetch, tokenProvider });
  const result = await client.getCluster({ cluster_id: "abc" });
  assert.equal(result.state, "RUNNING");
  assert.equal(fetchCalls, 2);
  assert.equal(invalidations, 1);
});
