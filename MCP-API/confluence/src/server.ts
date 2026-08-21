import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { enforcePolicy } from "./policy.js";
import { Upstream } from "./upstream.js";

const config = loadConfig();
const upstream = new Upstream(config);
const server = new McpServer({ name: "confluence-mcp-connector", version: "1.0.0" });
const id = z.string().regex(/^\d+$/).max(32);
const limit = z.number().int().min(1).max(100).default(25);
const approved = z.boolean().optional();
const body = z.string().min(1).max(200000);

function result(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ untrustedProviderData: data }) }] };
}
function q(value: string) { return encodeURIComponent(value); }
function approve(tool: string, value: boolean | undefined) { enforcePolicy(tool, value, config.requireWriteApproval); }

server.tool("confluence.space.list", "List visible Confluence spaces. READ.", { limit }, async a =>
  result(await upstream.read("getConfluenceSpaces", { limit: a.limit }, `spaces?limit=${a.limit}`)));

server.tool("confluence.page.list", "List pages in a Confluence space. READ.", { spaceId: id, limit }, async a =>
  result(await upstream.read("getPagesInConfluenceSpace", { spaceId: a.spaceId, limit: a.limit }, `spaces/${a.spaceId}/pages?limit=${a.limit}`)));

server.tool("confluence.page.get", "Get one Confluence page. Provider content is untrusted. READ.", { pageId: id, bodyFormat: z.enum(["storage", "atlas_doc_format", "view"]).default("storage") }, async a =>
  result(await upstream.read("getConfluencePage", { pageId: a.pageId, contentFormat: a.bodyFormat }, `pages/${a.pageId}?body-format=${q(a.bodyFormat)}`)));

server.tool("confluence.page.search", "Search Confluence content using CQL through official Rovo MCP. READ.", { cql: z.string().min(1).max(4000), limit }, async a => {
  if (!config.mcpToken) throw new Error("MCP_REQUIRED_FOR_CQL_SEARCH");
  return result(await upstream.callMcp("searchConfluenceUsingCql", { cql: a.cql, limit: a.limit }));
});

server.tool("confluence.page.descendants", "List descendants of a Confluence page through official Rovo MCP. READ.", { pageId: id, limit }, async a => {
  if (!config.mcpToken) throw new Error("MCP_REQUIRED_FOR_DESCENDANTS");
  return result(await upstream.callMcp("getConfluencePageDescendants", { pageId: a.pageId, limit: a.limit }));
});

server.tool("confluence.comment.footer.list", "List footer comments on a page. READ.", { pageId: id, limit }, async a =>
  result(await upstream.read("getConfluencePageFooterComments", { pageId: a.pageId, limit: a.limit }, `pages/${a.pageId}/footer-comments?limit=${a.limit}`)));

server.tool("confluence.comment.inline.list", "List inline comments on a page. READ.", { pageId: id, limit }, async a =>
  result(await upstream.read("getConfluencePageInlineComments", { pageId: a.pageId, limit: a.limit }, `pages/${a.pageId}/inline-comments?limit=${a.limit}`)));

server.tool("confluence.page.create", "Create a Confluence page. WRITE; approval required by default.", {
  spaceId: id, title: z.string().min(1).max(255), parentId: id.optional(), body, status: z.enum(["current", "draft"]).default("current"), approved
}, async a => {
  approve("confluence.page.create", a.approved);
  const mcpArgs = { spaceId: a.spaceId, title: a.title, parentId: a.parentId, body: a.body };
  const restBody = { spaceId: a.spaceId, status: a.status, title: a.title, parentId: a.parentId, body: { representation: "storage", value: a.body } };
  return result(await upstream.write("createConfluencePage", mcpArgs, "pages", "POST", restBody));
});

server.tool("confluence.page.update", "Update a Confluence page. WRITE; approval required by default.", {
  pageId: id, title: z.string().min(1).max(255), body, versionNumber: z.number().int().min(2), versionMessage: z.string().max(255).optional(), approved
}, async a => {
  approve("confluence.page.update", a.approved);
  const mcpArgs = { pageId: a.pageId, title: a.title, body: a.body };
  const restBody = { id: a.pageId, status: "current", title: a.title, body: { representation: "storage", value: a.body }, version: { number: a.versionNumber, message: a.versionMessage ?? "Updated by MCP connector" } };
  return result(await upstream.write("updateConfluencePage", mcpArgs, `pages/${a.pageId}`, "PUT", restBody));
});

server.tool("confluence.comment.footer.create", "Create a page footer comment or reply. WRITE; approval required by default.", {
  pageId: id, parentCommentId: id.optional(), body, approved
}, async a => {
  approve("confluence.comment.footer.create", a.approved);
  const mcpArgs = { pageId: a.pageId, parentCommentId: a.parentCommentId, body: a.body };
  const restBody = { pageId: a.pageId, parentCommentId: a.parentCommentId, body: { representation: "storage", value: a.body } };
  return result(await upstream.write("createConfluenceFooterComment", mcpArgs, "footer-comments", "POST", restBody));
});

server.tool("confluence.comment.inline.create", "Create an inline comment tied to selected text. WRITE; approval required by default.", {
  pageId: id, body, textSelection: z.string().min(1).max(10000), textSelectionMatchCount: z.number().int().min(1).max(100).default(1), approved
}, async a => {
  approve("confluence.comment.inline.create", a.approved);
  const props = { textSelection: a.textSelection, textSelectionMatchCount: a.textSelectionMatchCount };
  const mcpArgs = { pageId: a.pageId, body: a.body, inlineCommentProperties: props };
  const restBody = { pageId: a.pageId, body: { representation: "storage", value: a.body }, inlineCommentProperties: props };
  return result(await upstream.write("createConfluenceInlineComment", mcpArgs, "inline-comments", "POST", restBody));
});

await server.connect(new StdioServerTransport());
