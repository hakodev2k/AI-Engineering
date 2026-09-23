import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AlgoliaMcpClient } from "./mcp.js";
import { AlgoliaRestClient } from "./rest.js";
import { requireWriteApproval, safeIndexName } from "./security.js";

const upstream = new AlgoliaMcpClient();
const rest = new AlgoliaRestClient();
const server = new McpServer({ name: "algolia-connector", version: "1.0.0" });
const out = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value) }] });

server.tool("algolia.application.list", "READ: list Algolia applications through official Productivity MCP", {}, async () => out(await upstream.call("getApplications", {})));
server.tool("algolia.index.list", "READ: list indices", { applicationId: z.string().min(1) }, async a => out(await upstream.call("listIndices", a)));
server.tool("algolia.index.settings.get", "READ: get index settings", { applicationId: z.string().min(1), indexName: z.string().min(1).max(128) }, async a => out(await upstream.call("getSettings", { ...a, indexName: safeIndexName(a.indexName) })));
server.tool("algolia.record.search", "READ: search one index", { applicationId: z.string().min(1), indexName: z.string().min(1).max(128), query: z.string().max(1000), hitsPerPage: z.number().int().min(1).max(100).default(20) }, async a => out(await upstream.call("searchSingleIndex", { ...a, indexName: safeIndexName(a.indexName) })));
server.tool("algolia.analytics.top_searches", "READ: retrieve top searches", { applicationId: z.string().min(1), indexName: z.string().min(1).max(128), startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }, async a => out(await upstream.call("getTopSearches", { ...a, indexName: safeIndexName(a.indexName) })));
server.tool("algolia.analytics.no_results_rate", "READ: retrieve no-results rate", { applicationId: z.string().min(1), indexName: z.string().min(1).max(128), startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }, async a => out(await upstream.call("getNoResultsRate", { ...a, indexName: safeIndexName(a.indexName) })));
server.tool("algolia.record.create", "WRITE: add an object through official REST API; explicit approval required", { indexName: z.string().min(1).max(128), object: z.record(z.unknown()), approved: z.literal(true) }, async a => { requireWriteApproval(a.approved); return out(await rest.create(a.indexName, a.object)); });
server.tool("algolia.record.partial_update", "WRITE: partially update an object; explicit approval required", { indexName: z.string().min(1).max(128), objectID: z.string().min(1).max(512), attributes: z.record(z.unknown()), approved: z.literal(true) }, async a => { requireWriteApproval(a.approved); return out(await rest.partialUpdate(a.indexName, a.objectID, a.attributes)); });

await server.connect(new StdioServerTransport());
