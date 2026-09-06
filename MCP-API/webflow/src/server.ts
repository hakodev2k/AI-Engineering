import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { WebflowApiError, WebflowClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const config = loadConfig();
const client = new WebflowClient(config);
const enc = encodeURIComponent;
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

export async function dispatch(name: string, a: Record<string, any>, c: WebflowClient = client) {
  switch (name) {
    case "webflow.site.list": return c.request("GET", "/sites", undefined, { limit: a.limit, offset: a.offset });
    case "webflow.site.get": return c.request("GET", `/sites/${enc(a.siteId)}`);
    case "webflow.page.list": return c.request("GET", `/sites/${enc(a.siteId)}/pages`, undefined, { limit: a.limit, offset: a.offset, localeId: a.localeId });
    case "webflow.page.get": return c.request("GET", `/pages/${enc(a.pageId)}`, undefined, { localeId: a.localeId });
    case "webflow.page.content.get": return c.request("GET", `/pages/${enc(a.pageId)}/dom`, undefined, { localeId: a.localeId, limit: a.limit, offset: a.offset });
    case "webflow.collection.list": return c.request("GET", `/sites/${enc(a.siteId)}/collections`, undefined, { limit: a.limit, offset: a.offset });
    case "webflow.collection.get": return c.request("GET", `/collections/${enc(a.collectionId)}`);
    case "webflow.item.list": return c.request("GET", `/collections/${enc(a.collectionId)}/items`, undefined, { limit: a.limit, offset: a.offset, cmsLocaleId: a.cmsLocaleId });
    case "webflow.item.get": return c.request("GET", `/collections/${enc(a.collectionId)}/items/${enc(a.itemId)}`, undefined, { cmsLocaleId: a.cmsLocaleId });
    case "webflow.item.create": return c.request("POST", `/collections/${enc(a.collectionId)}/items`, {
      fieldData: a.fieldData,
      isDraft: a.isDraft,
      isArchived: a.isArchived,
      ...(a.cmsLocaleIds ? { cmsLocaleIds: a.cmsLocaleIds } : {})
    });
    case "webflow.item.update": return c.request("PATCH", `/collections/${enc(a.collectionId)}/items/${enc(a.itemId)}`, {
      fieldData: a.fieldData,
      ...(a.isDraft === undefined ? {} : { isDraft: a.isDraft }),
      ...(a.isArchived === undefined ? {} : { isArchived: a.isArchived }),
      ...(a.cmsLocaleId ? { cmsLocaleId: a.cmsLocaleId } : {})
    });
    case "webflow.item.publish": return c.request("POST", `/collections/${enc(a.collectionId)}/items/publish`, { itemIds: a.itemIds });
    case "webflow.item.delete": return c.request("DELETE", `/collections/${enc(a.collectionId)}/items/${enc(a.itemId)}`);
    case "webflow.site.publish": {
      if (!a.customDomains?.length && a.publishToWebflowSubdomain !== true) throw new Error("site.publish requires customDomains or publishToWebflowSubdomain=true.");
      return c.request("POST", `/sites/${enc(a.siteId)}/publish`, {
        ...(a.customDomains ? { customDomains: a.customDomains } : {}),
        ...(a.publishToWebflowSubdomain !== undefined ? { publishToWebflowSubdomain: a.publishToWebflowSubdomain } : {}),
        ...(a.pageId ? { pageId: a.pageId } : {})
      });
    }
    default: throw new Error("Unknown Webflow tool.");
  }
}

export const server = new Server({ name: "webflow-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(t => ({
    name: t.name,
    description: `${t.description} Permission=${t.permission.toUpperCase()}; Risk=${t.risk}; Approval=${t.approval}.`,
    inputSchema: t.inputSchema as any
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, any>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof WebflowApiError) {
      if (error.status === 400) throw new Error(`Webflow validation failed: ${error.message}`);
      if (error.status === 401) throw new Error("Webflow authentication failed. Verify or refresh WEBFLOW_ACCESS_TOKEN.");
      if (error.status === 403) throw new Error("Webflow denied the operation. Verify token scopes, site access, and role permissions.");
      if (error.status === 404) throw new Error("Webflow resource was not found.");
      if (error.status === 409) throw new Error(`Webflow reported a conflict: ${error.message}`);
      if (error.status === 429) throw new Error(`Webflow rate limit reached.${error.retryAfter !== undefined ? ` Retry after ${error.retryAfter}s.` : ""}`);
      if (error.status >= 500) throw new Error(`Webflow service error (${error.status}): ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
