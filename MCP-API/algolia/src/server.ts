import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { AlgoliaRest } from './rest.js';
import { AlgoliaMcp } from './mcp.js';

const cfg = loadConfig();
const rest = new AlgoliaRest(cfg);
const upstream = new AlgoliaMcp(cfg.mcpUrl);
const server = new McpServer({ name: 'algolia-connector', version: '1.0.0' });
const safeIndex = z.string().min(1).max(128).regex(/^[A-Za-z0-9_.-]+$/);
const objectId = z.string().min(1).max(256);
const approval = z.string().length(64).optional();
const jsonObject = z.record(z.string(), z.unknown());

server.tool('algolia.index.list', 'List Algolia indices visible to the configured key.', { page: z.number().int().min(0).max(1000).default(0), hitsPerPage: z.number().int().min(1).max(100).default(20) }, async a => out(await rest.listIndices(a.page, a.hitsPerPage)));
server.tool('algolia.record.search', 'Search an Algolia index. Uses official Algolia MCP when configured and compatible; otherwise falls back to the official Search API.', { index: safeIndex, query: z.string().max(1000).default(''), hitsPerPage: z.number().int().min(1).max(100).default(20), page: z.number().int().min(0).max(1000).default(0), filters: z.string().max(4000).optional(), attributesToRetrieve: z.array(z.string().min(1).max(128)).max(100).optional() }, async a => {
  const params = compact({ hitsPerPage: a.hitsPerPage, page: a.page, filters: a.filters, attributesToRetrieve: a.attributesToRetrieve });
  try { const m = await upstream.search(a.index, a.query, params); if (m) return out({ transport: 'mcp', result: m }); } catch {}
  return out({ transport: 'rest', result: await rest.search(a.index, { query: a.query, ...params }) });
});
server.tool('algolia.record.get', 'Retrieve one Algolia record by objectID.', { index: safeIndex, objectID: objectId }, async a => out(await rest.getRecord(a.index, a.objectID)));
server.tool('algolia.facet.search', 'Search values for a configured facet.', { index: safeIndex, facet: z.string().min(1).max(128), query: z.string().max(500).default(''), maxFacetHits: z.number().int().min(1).max(100).default(20) }, async a => out(await rest.searchFacet(a.index, a.facet, { facetQuery: a.query, maxFacetHits: a.maxFacetHits })));
server.tool('algolia.settings.get', 'Read index settings.', { index: safeIndex }, async a => out(await rest.getSettings(a.index)));
server.tool('algolia.analytics.top_searches', 'Retrieve top searches for an index from Algolia Analytics.', { index: safeIndex, startDate: date(), endDate: date(), limit: z.number().int().min(1).max(1000).default(10) }, async a => out(await rest.analytics('/2/searches', qs(a))));
server.tool('algolia.analytics.no_results', 'Retrieve searches with no results for an index from Algolia Analytics.', { index: safeIndex, startDate: date(), endDate: date(), limit: z.number().int().min(1).max(1000).default(10) }, async a => out(await rest.analytics('/2/searches/noResults', qs(a))));
server.tool('algolia.record.save', 'Create or replace one record. Requires explicit approval.', { index: safeIndex, record: jsonObject, approval }, async a => { const payload = { index: a.index, record: a.record }; assertApproval('algolia.record.save', payload, a.approval, cfg.approvalSecret); return out(await rest.saveRecord(a.index, a.record)); });
server.tool('algolia.settings.set', 'Change index settings. High risk and requires explicit approval.', { index: safeIndex, settings: jsonObject, approval }, async a => { const payload = { index: a.index, settings: a.settings }; assertApproval('algolia.settings.set', payload, a.approval, cfg.approvalSecret); return out(await rest.setSettings(a.index, a.settings)); });
server.tool('algolia.record.delete', 'Delete one record. Destructive, never retried automatically, and requires explicit approval.', { index: safeIndex, objectID: objectId, approval }, async a => { const payload = { index: a.index, objectID: a.objectID }; assertApproval('algolia.record.delete', payload, a.approval, cfg.approvalSecret); return out(await rest.deleteRecord(a.index, a.objectID)); });

await server.connect(new StdioServerTransport());
function out(value: unknown) { return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] }; }
function compact<T extends Record<string, unknown>>(x: T) { return Object.fromEntries(Object.entries(x).filter(([,v]) => v !== undefined)); }
function date() { return z.string().regex(/^\d{4}-\d{2}-\d{2}$/); }
function qs(a: { index: string; startDate: string; endDate: string; limit: number }) { return new URLSearchParams({ index: a.index, startDate: a.startDate, endDate: a.endDate, limit: String(a.limit) }); }
