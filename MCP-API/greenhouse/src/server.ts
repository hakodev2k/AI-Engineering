import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GreenhouseTokenProvider, GreenhouseAuthError } from "./auth.js";
import { GreenhouseApiError, GreenhouseClient } from "./client.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const config = loadConfig();
const tokenProvider = new GreenhouseTokenProvider(config);
const client = new GreenhouseClient(config, tokenProvider);

function listQuery(args: Record<string, unknown>) {
  if (args.cursor) return { cursor: String(args.cursor) };
  return { per_page: args.perPage ? String(args.perPage) : undefined };
}
function csv(value: unknown) { return Array.isArray(value) ? value.join(",") : undefined; }
function output(value: unknown) { return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] }; }

async function dispatch(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "greenhouse.job.list": return client.request("GET", "/v3/jobs", undefined, args.cursor ? { cursor: String(args.cursor) } : { per_page: args.perPage ? String(args.perPage) : undefined, status: args.status ? String(args.status) : undefined, department_id: args.departmentId ? String(args.departmentId) : undefined, office_id: args.officeId ? String(args.officeId) : undefined });
    case "greenhouse.job.get": return client.request("GET", "/v3/jobs", undefined, { ids: String(args.jobId), per_page: "1" });
    case "greenhouse.job_post.list": return client.request("GET", "/v3/job_posts", undefined, args.cursor ? { cursor: String(args.cursor) } : { ...listQuery(args), job_ids: csv(args.jobIds), live: args.live === undefined ? undefined : String(args.live), internal: args.internal === undefined ? undefined : String(args.internal) });
    case "greenhouse.candidate.list": return client.request("GET", "/v3/candidates", undefined, args.cursor ? { cursor: String(args.cursor) } : { ...listQuery(args), ids: csv(args.candidateIds) });
    case "greenhouse.candidate.get": return client.request("GET", "/v3/candidates", undefined, { ids: String(args.candidateId), per_page: "1" });
    case "greenhouse.application.list": return client.request("GET", "/v3/applications", undefined, args.cursor ? { cursor: String(args.cursor) } : { ...listQuery(args), candidate_ids: csv(args.candidateIds), job_ids: csv(args.jobIds), status: args.status ? String(args.status) : undefined });
    case "greenhouse.application.get": return client.request("GET", "/v3/applications", undefined, { ids: String(args.applicationId), per_page: "1" });
    case "greenhouse.interview.list": return client.request("GET", "/v3/interviews", undefined, args.cursor ? { cursor: String(args.cursor) } : { ...listQuery(args), ids: csv(args.interviewIds), "starts_at[gte]": args.startsAtGte ? String(args.startsAtGte) : undefined, "starts_at[lte]": args.startsAtLte ? String(args.startsAtLte) : undefined });
    case "greenhouse.offer.list": return client.request("GET", "/v3/offers", undefined, args.cursor ? { cursor: String(args.cursor) } : { ...listQuery(args), application_ids: csv(args.applicationIds), candidate_ids: csv(args.candidateIds), current_only: args.currentOnly === undefined ? undefined : String(args.currentOnly), status: args.status ? String(args.status) : undefined });
    case "greenhouse.offer.get": return client.request("GET", "/v3/offers", undefined, { ids: String(args.offerId), per_page: "1" });
    case "greenhouse.department.list": return client.request("GET", "/v3/departments", undefined, listQuery(args));
    case "greenhouse.office.list": return client.request("GET", "/v3/offices", undefined, listQuery(args));
    case "greenhouse.candidate.create": return client.request("POST", "/v3/candidates", { first_name: args.firstName, last_name: args.lastName, preferred_name: args.preferredName, company: args.company, title: args.title, email_addresses: args.emailAddresses, can_email: args.canEmail });
    case "greenhouse.application.create": return client.request("POST", "/v3/applications", { candidate_id: args.candidateId, job_id: args.jobId, initial_stage_id: args.initialStageId, source_id: args.sourceId, recruiter_id: args.recruiterId, coordinator_id: args.coordinatorId });
    default: throw new Error("Tool is not exposed by this connector.");
  }
}

export const server = new Server({ name: "greenhouse-recruiting-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(tool => ({ name: tool.name, description: `${tool.description} Risk=${tool.risk}.`, inputSchema: tool.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return output(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof GreenhouseAuthError) throw new Error("Greenhouse OAuth authentication failed. Verify client credentials and grant configuration.");
    if (error instanceof GreenhouseApiError) {
      if (error.status === 401) throw new Error("Greenhouse access token is invalid or expired.");
      if (error.status === 403) throw new Error("Greenhouse denied this operation. Verify Harvest v3 scopes and authorizing-user permissions.");
      if (error.status === 422) throw new Error(`Greenhouse validation failed: ${error.message}`);
      if (error.status === 429) throw new Error(`Greenhouse rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter} seconds.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
