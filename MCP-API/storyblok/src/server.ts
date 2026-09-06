import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { StoryblokApiError, StoryblokClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new StoryblokClient(config);
const space = encodeURIComponent(config.spaceId);
const base = `/spaces/${space}`;
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const q = (v: unknown) => v === undefined ? undefined : String(v);

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "storyblok.story.list": return client.request("GET", `${base}/stories`, undefined, { page:q(a.page), per_page:q(a.perPage), text_search:q(a.textSearch), by_slugs:q(a.bySlugs), is_published:q(a.isPublished), with_summary:q(a.withSummary) });
    case "storyblok.story.get": return client.request("GET", `${base}/stories/${encodeURIComponent(String(a.storyId))}`);
    case "storyblok.story.create": {
      const story: Record<string, unknown> = { name:a.name, slug:a.slug, content:a.content };
      if (a.parentId !== undefined) story.parent_id = a.parentId;
      if (a.isFolder !== undefined) story.is_folder = a.isFolder;
      return client.request("POST", `${base}/stories`, { story });
    }
    case "storyblok.story.update": {
      const story: Record<string, unknown> = {};
      if (a.name !== undefined) story.name = a.name;
      if (a.slug !== undefined) story.slug = a.slug;
      if (a.content !== undefined) story.content = a.content;
      return client.request("PUT", `${base}/stories/${encodeURIComponent(String(a.storyId))}`, { story });
    }
    case "storyblok.story.publish": return client.request("PUT", `${base}/stories/${encodeURIComponent(String(a.storyId))}`, { publish:true });
    case "storyblok.story.delete": return client.request("DELETE", `${base}/stories/${encodeURIComponent(String(a.storyId))}`);
    case "storyblok.component.list": return client.request("GET", `${base}/components`, undefined, { search:q(a.search), is_root:q(a.isRoot), in_group:q(a.inGroup), sort_by:q(a.sortBy) });
    case "storyblok.component.get": return client.request("GET", `${base}/components/${encodeURIComponent(String(a.componentId))}`);
    case "storyblok.tag.list": return client.request("GET", `${base}/tags`, undefined, { search:q(a.search), all_tags:a.allTags ? "true" : undefined, page:q(a.page), per_page:q(a.perPage) });
    default: throw new Error("Unknown Storyblok tool.");
  }
}

export const server = new Server({ name:"storyblok-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name:t.name, description:`${t.description} Risk=${t.risk}.`, inputSchema:t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof StoryblokApiError) {
      if (error.status === 401) throw new Error("Storyblok authentication failed. Verify or renew the token.");
      if (error.status === 403) throw new Error("Storyblok denied the operation. Verify space role and token permissions.");
      if (error.status === 404) throw new Error("Storyblok resource was not found.");
      if (error.status === 422) throw new Error(`Storyblok validation failed: ${error.message}`);
      if (error.status === 429) throw new Error(`Storyblok rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
