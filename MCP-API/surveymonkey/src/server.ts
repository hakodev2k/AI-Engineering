import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { SurveyMonkeyApiError, SurveyMonkeyClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new SurveyMonkeyClient(config);
const enc = (value: unknown) => encodeURIComponent(String(value));
const q = (value: unknown) => value === undefined ? undefined : String(value);
const result = (value: unknown) => ({ content: [{ type:"text" as const, text:JSON.stringify(value, null, 2) }] });

function validateWebhook(args: Record<string, unknown>) {
  const event = String(args.eventType);
  const objectType = args.objectType === undefined ? undefined : String(args.objectType);
  const objectIds = args.objectIds as string[] | undefined;
  if (objectType && (!objectIds || objectIds.length === 0)) throw new Error("objectIds are required when objectType is set.");
  if (event === "survey_created" && objectType) throw new Error("survey_created must not set objectType.");
  if (["survey_updated","survey_deleted"].includes(event) && objectType !== "survey") throw new Error(`${event} requires objectType=survey.`);
  if (["app_installed","app_uninstalled"].includes(event) && objectType && objectType !== "app") throw new Error(`${event} only supports objectType=app when filtering.`);
  if (event === "collector_created" && objectType === "collector") throw new Error("collector_created must not filter by objectType=collector.");
}

export async function dispatch(name: string, a: Record<string, unknown>, api: SurveyMonkeyClient = client) {
  const pagination = { page:q(a.page), per_page:q(a.perPage) };
  switch (name) {
    case "surveymonkey.user.get": return api.request("GET", "/users/me");
    case "surveymonkey.survey.list": return api.request("GET", "/surveys", undefined, { query:q(a.query), ...pagination });
    case "surveymonkey.survey.get": return api.request("GET", `/surveys/${enc(a.surveyId)}`);
    case "surveymonkey.survey.details.get": return api.request("GET", `/surveys/${enc(a.surveyId)}/details`);
    case "surveymonkey.survey.create": return api.request("POST", "/surveys", { title:a.title, language:a.language });
    case "surveymonkey.survey.update": return api.request("PATCH", `/surveys/${enc(a.surveyId)}`, { title:a.title, nickname:a.nickname, language:a.language });
    case "surveymonkey.page.list": return api.request("GET", `/surveys/${enc(a.surveyId)}/pages`, undefined, pagination);
    case "surveymonkey.question.list": return api.request("GET", `/surveys/${enc(a.surveyId)}/pages/${enc(a.pageId)}/questions`, undefined, pagination);
    case "surveymonkey.collector.list": return api.request("GET", `/surveys/${enc(a.surveyId)}/collectors`, undefined, pagination);
    case "surveymonkey.collector.create_link": return api.request("POST", `/surveys/${enc(a.surveyId)}/collectors`, { type:"weblink", name:a.name });
    case "surveymonkey.response.list": return api.request("GET", `/surveys/${enc(a.surveyId)}/responses/bulk`, undefined, pagination);
    case "surveymonkey.response.get": return api.request("GET", `/surveys/${enc(a.surveyId)}/responses/${enc(a.responseId)}/details`);
    case "surveymonkey.response.summary": return api.request("GET", `/surveys/${enc(a.surveyId)}/rollups`);
    case "surveymonkey.webhook.list": return api.request("GET", "/webhooks", undefined, { ...pagination, event_type:q(a.eventType) });
    case "surveymonkey.webhook.create":
      validateWebhook(a);
      return api.request("POST", "/webhooks", { name:a.name, subscription_url:a.subscriptionUrl, event_type:a.eventType, object_type:a.objectType, object_ids:a.objectIds });
    default: throw new Error("Tool is not exposed by this SurveyMonkey connector.");
  }
}

export const server = new Server({ name:"surveymonkey-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools:TOOLS.map(t => ({ name:t.name, description:`${t.description} Required permission: ${t.permission}. Risk=${t.risk}. Approval=${t.approval ? "required" : "not required"}.`, inputSchema:t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof SurveyMonkeyApiError) {
      if (error.status === 401) throw new Error("SurveyMonkey authentication failed. Verify the access token and app state.");
      if (error.status === 402) throw new Error(`SurveyMonkey plan limit blocked this operation: ${error.message}`);
      if (error.status === 403) throw new Error("SurveyMonkey denied the operation. Verify OAuth scopes, plan entitlements, and survey access.");
      if (error.status === 404) throw new Error("SurveyMonkey resource was not found.");
      if (error.status === 413) throw new Error("SurveyMonkey rejected an oversized survey or request.");
      if (error.status === 429) throw new Error(`SurveyMonkey rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    if (error instanceof Error && error.name === "AbortError") throw new Error("SurveyMonkey request timed out.");
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
