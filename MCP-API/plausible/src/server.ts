import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { PlausibleApiError, PlausibleClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const cfg = loadConfig();
const api = new PlausibleClient(cfg);
const encoded = (v: unknown) => encodeURIComponent(String(v));
const q = (args: Record<string, unknown>) => ({
  after: args.after ? String(args.after) : undefined,
  before: args.before ? String(args.before) : undefined,
  limit: args.limit ? String(args.limit) : undefined
});
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "plausible.stats.query": return api.request("POST", "/api/v2/query", "stats", {
      site_id: a.siteId, metrics: a.metrics, date_range: a.dateRange, dimensions: a.dimensions,
      filters: a.filters, include: a.include, pagination: a.pagination
    });
    case "plausible.site.list": return api.request("GET", "/api/v1/sites", "sites", undefined, { ...q(a), team_id: a.teamId ? String(a.teamId) : undefined });
    case "plausible.team.list": return api.request("GET", "/api/v1/sites/teams", "sites", undefined, q(a));
    case "plausible.site.get": return api.request("GET", `/api/v1/sites/${encoded(a.siteId)}`, "sites");
    case "plausible.goal.list": return api.request("GET", "/api/v1/sites/goals", "sites", undefined, { site_id: String(a.siteId) });
    case "plausible.custom_property.list": return api.request("GET", "/api/v1/sites/custom-props", "sites", undefined, { site_id: String(a.siteId) });
    case "plausible.guest.list": return api.request("GET", "/api/v1/sites/guests", "sites", undefined, { site_id: String(a.siteId), ...q(a) });
    case "plausible.site.create": return api.request("POST", "/api/v1/sites", "sites", { domain: a.domain, timezone: a.timezone, tracker_script_configuration: a.trackerScriptConfiguration });
    case "plausible.site.update": return api.request("PUT", `/api/v1/sites/${encoded(a.siteId)}`, "sites", { domain: a.domain, tracker_script_configuration: a.trackerScriptConfiguration });
    case "plausible.goal.ensure": return api.request("PUT", "/api/v1/sites/goals", "sites", { site_id:a.siteId, goal_type:a.goalType, event_name:a.eventName, page_path:a.pagePath, display_name:a.displayName, custom_props:a.customProps });
    case "plausible.custom_property.ensure": return api.request("PUT", "/api/v1/sites/custom-props", "sites", { site_id:a.siteId, property:a.property });
    case "plausible.guest.invite": return api.request("PUT", "/api/v1/sites/guests", "sites", { site_id:a.siteId, email:a.email, role:a.role });
    case "plausible.event.track": {
      const domain = String(a.domain);
      if (!cfg.allowedSites.has(domain)) throw new Error("Event domain is not in PLAUSIBLE_ALLOWED_SITES.");
      return api.request("POST", "/api/event", "none", { domain, name:a.name, url:a.url, referrer:a.referrer, props:a.props, revenue:a.revenue, interactive:a.interactive }, undefined, {
        "User-Agent": String(a.userAgent), ...(a.forwardedFor ? { "X-Forwarded-For": String(a.forwardedFor) } : {})
      });
    }
    case "plausible.site.delete": return api.request("DELETE", `/api/v1/sites/${encoded(a.siteId)}`, "sites");
    case "plausible.goal.delete": return api.request("DELETE", `/api/v1/sites/goals/${encoded(a.goalId)}`, "sites", { site_id:a.siteId });
    case "plausible.custom_property.delete": return api.request("DELETE", `/api/v1/sites/custom-props/${encoded(a.property)}`, "sites", { site_id:a.siteId });
    case "plausible.guest.remove": return api.request("DELETE", `/api/v1/sites/guests/${encoded(a.email)}`, "sites", { site_id:a.siteId });
    default: throw new Error("Tool is not exposed by this connector.");
  }
}

export const server = new Server({ name: "plausible-analytics-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name:t.name, description:`${t.description} Risk=${t.risk}.`, inputSchema:t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, cfg);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof PlausibleApiError) {
      if (error.status === 401) throw new Error("Plausible authentication failed. Verify the API key for this capability.");
      if (error.status === 403) throw new Error("Plausible denied the operation. Verify plan, team ownership, role, and API key scope.");
      if (error.status === 404) throw new Error("Plausible resource was not found or is outside the key scope.");
      if (error.status === 429) throw new Error(`Plausible rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
