import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { SurveyMonkeyApiError, SurveyMonkeyClient } from "../src/client.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";
import { dispatch } from "../src/server.js";

const baseEnv = { SURVEYMONKEY_ACCESS_TOKEN:"secret", SURVEYMONKEY_API_BASE_URL:"https://api.surveymonkey.com/v3" } as NodeJS.ProcessEnv;

test("config requires token and restricts API host", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv));
  assert.throws(() => loadConfig({ SURVEYMONKEY_ACCESS_TOKEN:"x", SURVEYMONKEY_API_BASE_URL:"https://evil.example/v3" } as NodeJS.ProcessEnv));
  assert.equal(loadConfig(baseEnv).apiBaseUrl, "https://api.surveymonkey.com/v3");
  assert.equal(loadConfig({ ...baseEnv, SURVEYMONKEY_API_BASE_URL:"https://api.surveymonkey.ca/v3" }).apiBaseUrl, "https://api.surveymonkey.ca/v3");
});

test("tool registry exposes focused surface", () => {
  assert.equal(TOOLS.length, 15);
  assert.ok(TOOL_MAP.has("surveymonkey.response.summary"));
  assert.ok(!TOOL_MAP.has("surveymonkey.execute_any_api_request"));
});

test("strict validation rejects unknown fields and invalid ids", () => {
  assert.throws(() => TOOL_MAP.get("surveymonkey.survey.get")!.schema.parse({ surveyId:"abc/def" }));
  assert.throws(() => TOOL_MAP.get("surveymonkey.survey.get")!.schema.parse({ surveyId:"123", token:"leak" }));
});

test("writes default deny and approval token is connector-side", () => {
  const config = loadConfig(baseEnv);
  assert.throws(() => assertAllowed("WRITE", "surveymonkey.survey.create", {approvalToken:"12345678"}, config));
  const enabled = loadConfig({ ...baseEnv, SURVEYMONKEY_ALLOW_WRITES:"true", SURVEYMONKEY_APPROVAL_TOKEN:"approved-token" });
  assert.throws(() => assertAllowed("HIGH_RISK", "surveymonkey.webhook.create", {approvalToken:"wrong-token"}, enabled));
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "surveymonkey.webhook.create", {approvalToken:"approved-token"}, enabled));
});

test("client sends bearer credential only in transport header", async () => {
  let auth = "";
  const fakeFetch: typeof fetch = async (_input, init) => {
    auth = new Headers(init?.headers).get("authorization") || "";
    return new Response(JSON.stringify({id:"1"}), {status:200, headers:{"content-type":"application/json"}});
  };
  const client = new SurveyMonkeyClient(loadConfig(baseEnv), fakeFetch);
  const value = await client.request("GET", "/users/me");
  assert.equal(auth, "Bearer secret");
  assert.equal((value.data as any).id, "1");
});

test("GET retries 429 but write does not retry", async () => {
  let gets = 0;
  const getFetch: typeof fetch = async () => {
    gets++;
    if (gets === 1) return new Response(JSON.stringify({error:{message:"slow"}}), {status:429, headers:{"retry-after":"0"}});
    return new Response(JSON.stringify({data:[]}), {status:200});
  };
  const cfg = loadConfig({ ...baseEnv, SURVEYMONKEY_MAX_RETRIES:"1" });
  await new SurveyMonkeyClient(cfg, getFetch).request("GET", "/surveys");
  assert.equal(gets, 2);

  let posts = 0;
  const postFetch: typeof fetch = async () => { posts++; return new Response(JSON.stringify({error:{message:"busy"}}), {status:503}); };
  await assert.rejects(() => new SurveyMonkeyClient(cfg, postFetch).request("POST", "/surveys", {title:"x"}), SurveyMonkeyApiError);
  assert.equal(posts, 1);
});

test("dispatch maps pagination and webhook validation", async () => {
  const calls: any[] = [];
  const fake = { request: async (...args:any[]) => { calls.push(args); return {data:{ok:true},meta:{}}; } } as unknown as SurveyMonkeyClient;
  await dispatch("surveymonkey.survey.list", {query:"nps",page:2,perPage:50}, fake);
  assert.deepEqual(calls[0][3], {query:"nps",page:"2",per_page:"50"});
  await assert.rejects(() => dispatch("surveymonkey.webhook.create", {name:"x",subscriptionUrl:"https://example.com/h",eventType:"survey_updated",objectType:"collector",objectIds:["1"]}, fake));
});

test("timeout aborts request without live credentials", async () => {
  const fakeFetch: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), {name:"AbortError"})));
  });
  const cfg = loadConfig({ ...baseEnv, SURVEYMONKEY_TIMEOUT_MS:"1", SURVEYMONKEY_MAX_RETRIES:"0" });
  await assert.rejects(() => new SurveyMonkeyClient(cfg, fakeFetch).request("GET", "/users/me"), /aborted/);
});
