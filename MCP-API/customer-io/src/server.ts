import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { CustomerIoApiError, CustomerIoClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const api = new CustomerIoClient(config);
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const q = (v: unknown) => v === undefined ? undefined : String(v);
const personPath = (a: Record<string, unknown>, suffix: string) => `/v1/customers/${encodeURIComponent(String(a.customerId))}/${suffix}`;

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "customerio.profile.search": {
      const attribute: Record<string, unknown> = { field: a.field, operator: a.operator };
      if (a.operator === "eq") attribute.value = a.value;
      return api.request("POST", "/v1/customers", { filter: { attribute } }, { limit: q(a.limit), start: q(a.start) });
    }
    case "customerio.profile.attributes.get": return api.request("GET", personPath(a, "attributes"), undefined, { id_type: q(a.idType) });
    case "customerio.profile.segments.list": return api.request("GET", personPath(a, "segments"), undefined, { id_type: q(a.idType) });
    case "customerio.profile.messages.list": return api.request("GET", personPath(a, "messages"), undefined, { id_type: q(a.idType), start_ts: q(a.startTs), end_ts: q(a.endTs), limit: q(a.limit) });
    case "customerio.segment.list": return api.request("GET", "/v1/segments");
    case "customerio.segment.get": return api.request("GET", `/v1/segments/${a.segmentId}`);
    case "customerio.segment.members.list": return api.request("GET", `/v1/segments/${a.segmentId}/membership`, undefined, { limit: q(a.limit), start: q(a.start) });
    case "customerio.segment.create_manual": return api.request("POST", "/v1/segments", { segment: { name: a.name, ...(a.description ? { description: a.description } : {}) } });
    case "customerio.automation.list": return api.request("GET", "/v1/campaigns");
    case "customerio.automation.get": return api.request("GET", `/v1/campaigns/${a.campaignId}`);
    case "customerio.automation.actions.list": return api.request("GET", `/v1/campaigns/${a.campaignId}/actions`, undefined, { start: q(a.start) });
    case "customerio.newsletter.list": return api.request("GET", "/v1/newsletters");
    case "customerio.transactional.email.send": return api.request("POST", "/v1/send/email", {
      transactional_message_id: a.transactionalMessageId,
      to: a.to,
      identifiers: { [String(a.identifierType)]: a.identifier },
      ...(a.messageData ? { message_data: a.messageData } : {}),
      ...(a.sendToUnsubscribed !== undefined ? { send_to_unsubscribed: a.sendToUnsubscribed } : {}),
      ...(a.tracked !== undefined ? { tracked: a.tracked } : {}),
      ...(a.queueDraft !== undefined ? { queue_draft: a.queueDraft } : {})
    });
    case "customerio.reporting_webhook.list": return api.request("GET", "/v1/reporting_webhooks");
    case "customerio.reporting_webhook.create": return api.request("POST", "/v1/reporting_webhooks", { name: a.name, endpoint: a.endpoint, events: a.events, disabled: a.disabled ?? false, full_resolution: a.fullResolution ?? false, with_content: a.withContent ?? false });
    case "customerio.reporting_webhook.delete": return api.request("DELETE", `/v1/reporting_webhooks/${a.webhookId}`);
    default: throw new Error("Unknown Customer.io tool.");
  }
}

export const server = new Server({ name: "customer-io-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, description: `${t.description} Risk=${t.risk}.`, inputSchema: t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof CustomerIoApiError) {
      if (error.status === 401) throw new Error("Customer.io authentication failed. Verify the App API key and workspace.");
      if (error.status === 403) throw new Error("Customer.io denied this operation. Verify API-key scope and workspace permissions.");
      if (error.status === 404) throw new Error(`Customer.io resource not found: ${error.message}`);
      if (error.status === 429) throw new Error(`Customer.io rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
