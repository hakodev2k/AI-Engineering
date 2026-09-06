import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { HelpScoutApiError, HelpScoutClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new HelpScoutClient(config);

function result(value: unknown) {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({ provider: "helpscout", untrustedProviderData: true, result: value }, null, 2)
    }]
  };
}

async function dispatch(name: string, args: Record<string, unknown>) {
  const cid = args.conversationId === undefined ? undefined : encodeURIComponent(String(args.conversationId));
  switch (name) {
    case "helpscout.inbox.list":
      return client.request("GET", "/v2/mailboxes", undefined, { page: args.page as number | undefined });
    case "helpscout.inbox.get":
      return client.request("GET", `/v2/mailboxes/${encodeURIComponent(String(args.inboxId))}`);
    case "helpscout.conversation.list":
      return client.request("GET", "/v2/conversations", undefined, {
        mailbox: args.mailbox as number | undefined,
        status: args.status as string | undefined,
        query: args.query as string | undefined,
        page: args.page as number | undefined
      });
    case "helpscout.conversation.get":
      return client.request("GET", `/v3/conversations/${cid}`);
    case "helpscout.conversation.threads.list":
      return client.request("GET", `/v3/conversations/${cid}/threads`, undefined, { page: args.page as number | undefined });
    case "helpscout.customer.list":
      return client.request("GET", "/v2/customers", undefined, {
        mailbox: args.mailbox as number | undefined,
        firstName: args.firstName as string | undefined,
        lastName: args.lastName as string | undefined,
        query: args.query as string | undefined,
        page: args.page as number | undefined
      });
    case "helpscout.customer.get":
      return client.request("GET", `/v2/customers/${encodeURIComponent(String(args.customerId))}`);
    case "helpscout.user.list":
      return client.request("GET", "/v2/users", undefined, {
        email: args.email as string | undefined,
        mailbox: args.mailbox as number | undefined,
        page: args.page as number | undefined
      });
    case "helpscout.team.list":
      return client.request("GET", "/v2/teams", undefined, { page: args.page as number | undefined });
    case "helpscout.conversation.note.create":
      return client.request("POST", `/v2/conversations/${cid}/notes`, {
        text: args.text,
        ...(args.status ? { status: args.status } : {})
      });
    case "helpscout.conversation.reply.draft.create":
      return client.request("POST", `/v2/conversations/${cid}/reply`, {
        customer: { id: args.customerId },
        text: args.text,
        draft: true,
        ...(args.status ? { status: args.status } : {}),
        ...(args.cc ? { cc: args.cc } : {}),
        ...(args.bcc ? { bcc: args.bcc } : {})
      });
    case "helpscout.conversation.reply.send":
      return client.request("POST", `/v2/conversations/${cid}/reply`, {
        customer: { id: args.customerId },
        text: args.text,
        draft: false,
        ...(args.status ? { status: args.status } : {}),
        ...(args.assignTo ? { assignTo: args.assignTo } : {}),
        ...(args.cc ? { cc: args.cc } : {}),
        ...(args.bcc ? { bcc: args.bcc } : {})
      });
    case "helpscout.conversation.status.update":
      return client.request("PATCH", `/v2/conversations/${cid}`, { op: "replace", path: "/status", value: args.status });
    case "helpscout.conversation.assign":
      return client.request("PATCH", `/v2/conversations/${cid}`, { op: "replace", path: "/assignTo", value: args.assigneeId });
    case "helpscout.conversation.unassign":
      return client.request("PATCH", `/v2/conversations/${cid}`, { op: "remove", path: "/assignTo" });
    case "helpscout.conversation.tags.replace":
      return client.request("PUT", `/v2/conversations/${cid}/tags`, { tags: args.tags });
    case "helpscout.webhook.list":
      return client.request("GET", "/v2/webhooks", undefined, { page: args.page as number | undefined });
    case "helpscout.webhook.create":
      if (!config.webhookSecret) throw new Error("HELPSCOUT_WEBHOOK_SECRET is required for webhook creation.");
      return client.request("POST", "/v2/webhooks", {
        url: args.url,
        events: args.events,
        secret: config.webhookSecret,
        payloadVersion: "V3",
        ...(args.label ? { label: args.label } : {}),
        ...(args.mailboxIds ? { mailboxIds: args.mailboxIds } : {}),
        ...(args.notification !== undefined ? { notification: args.notification } : {})
      });
    default:
      throw new Error("Unknown Help Scout tool.");
  }
}

export const server = new Server(
  { name: "helpscout-connector", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(tool => ({
    name: tool.name,
    description: `${tool.purpose} Permission=${tool.permission}; Risk=${tool.risk}; Approval=${tool.approval}; Output=${tool.output}`,
    inputSchema: tool.inputSchema as any
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try {
    return result(await dispatch(tool.name, args));
  } catch (error) {
    if (error instanceof HelpScoutApiError) {
      if (error.status === 401) throw new Error("Help Scout authentication failed. Re-authorize or verify OAuth application credentials.");
      if (error.status === 403) throw new Error("Help Scout denied this operation. The OAuth application's associated user lacks permission.");
      if (error.status === 404) throw new Error("Help Scout resource was not found. It may have been removed or merged.");
      if (error.status === 412 || error.status === 423) throw new Error(`Help Scout resource is locked or cannot be modified: ${error.message}`);
      if (error.status === 429) throw new Error(`Help Scout rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter} seconds.` : ""}`);
      if (error.status >= 300 && error.status < 400) throw new Error(`Help Scout resource moved; re-fetch the canonical resource.${error.location ? ` Location: ${error.location}` : ""}`);
      throw new Error(`Help Scout API error ${error.status}: ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
