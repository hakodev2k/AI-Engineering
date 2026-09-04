import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ZodError } from "zod";
import { loadConfig } from "./config.js";
import { LoopsApiError, LoopsClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_BY_NAME, TOOLS } from "./tools.js";

function json(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

function stripApproval(args: Record<string, unknown>) {
  const { approval, ...rest } = args;
  return { rest, approval: approval as { confirmed?: boolean; reason?: string } | undefined };
}

export function buildServer(client: LoopsClient, cfg = loadConfig()) {
  const server = new Server({ name: "loops-safe-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, description: `${t.description} Risk=${t.risk}.`, inputSchema: t.inputSchema })) }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = TOOL_BY_NAME.get(request.params.name);
    if (!tool) throw new Error("Unknown Loops tool.");
    let parsed: Record<string, unknown>;
    try { parsed = tool.parse(request.params.arguments ?? {}); }
    catch (e) { if (e instanceof ZodError) throw new Error(`Invalid input: ${e.issues.map(i => i.message).join("; ")}`); throw e; }

    const { rest, approval } = stripApproval(parsed);
    assertAllowed(tool.risk, approval, cfg);

    try {
      switch (tool.name) {
        case "loops.contact.find":
          return json(await client.request("/v1/contacts/find", { query: rest as Record<string, string> }));
        case "loops.contact.create": {
          const { properties, ...known } = rest;
          return json(await client.request("/v1/contacts/create", { method: "POST", body: { ...known, ...(properties as object ?? {}) } }));
        }
        case "loops.contact.update": {
          const { properties, ...known } = rest;
          return json(await client.request("/v1/contacts/update", { method: "PUT", body: { ...known, ...(properties as object ?? {}) } }));
        }
        case "loops.contact.delete":
          return json(await client.request("/v1/contacts/delete", { method: "POST", body: rest }));
        case "loops.mailing_list.list":
          return json(await client.request("/v1/lists"));
        case "loops.event.send": {
          const { idempotencyKey, ...body } = rest;
          return json(await client.request("/v1/events/send", { method: "POST", body, idempotencyKey: idempotencyKey as string | undefined }));
        }
        case "loops.transactional_email.list":
          return json(await client.request("/v1/transactional-emails", { query: rest as Record<string, string | number> }));
        case "loops.transactional_email.get":
          return json(await client.request(`/v1/transactional-emails/${encodeURIComponent(String(rest.transactionalId))}`));
        case "loops.transactional_email.send": {
          const { idempotencyKey, ...body } = rest;
          return json(await client.request("/v1/transactional", { method: "POST", body, idempotencyKey: idempotencyKey as string | undefined }));
        }
        case "loops.workflow.list":
          return json(await client.request("/v1/workflows"));
        case "loops.workflow.get":
          return json(await client.request(`/v1/workflows/${encodeURIComponent(String(rest.workflowId))}`));
        case "loops.workflow.create":
          return json(await client.request("/v1/workflows", { method: "POST", body: rest.workflow }));
        case "loops.workflow.update": {
          const { workflowId, changes, revision } = rest;
          return json(await client.request(`/v1/workflows/${encodeURIComponent(String(workflowId))}`, { method: "POST", body: { ...(changes as object), revision } }));
        }
        default:
          throw new Error("Tool route is not implemented.");
      }
    } catch (e) {
      if (e instanceof LoopsApiError) {
        if (e.status === 401) throw new Error("Loops authentication failed. Check LOOPS_API_KEY.");
        if (e.status === 429) throw new Error(`Loops rate limit exceeded (10 requests/second/team).${e.retryAfter ? ` Retry-After: ${e.retryAfter}` : ""}`);
        if (e.status === 409) throw new Error(`Loops conflict: ${e.message}. For send/event idempotency, a key reused within 24 hours returns 409.`);
        if (e.status === 422) throw new Error(`Loops validation/LMX compile error: ${e.message}`);
      }
      throw e;
    }
  });

  return server;
}

async function main() {
  const cfg = loadConfig();
  const client = new LoopsClient(cfg);
  const server = buildServer(client, cfg);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
}
