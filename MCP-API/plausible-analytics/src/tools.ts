import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PlausibleClient } from "./client.js";
import type { PlausibleConfig } from "./config.js";
import { requireApproval } from "./policy.js";

const dateRange = z.union([z.enum(["day","24h","7d","28d","30d","91d","month","6mo","12mo","year","all"]), z.tuple([z.string().min(10), z.string().min(10)])]);
const metrics = z.array(z.enum(["visitors","visits","pageviews","views_per_visit","bounce_rate","visit_duration","events"])).min(1).max(7);
const site = z.string().min(1).max(253);
const safeUrl = z.string().url().refine(v => !v.startsWith("data:"), "data: URLs are not allowed");
const props = z.record(z.union([z.string().max(2000), z.number(), z.boolean()])).refine(v => Object.keys(v).length <= 30, "At most 30 properties are allowed");
const filter = z.tuple([z.enum(["is","is_not","contains","contains_not","matches","matches_not"]), z.string().min(1).max(300), z.array(z.string().max(2000)).min(1).max(50)]);

function text(value: unknown) { return { content: [{ type: "text" as const, text: JSON.stringify(value) }] }; }
function q(site_id: string, range: unknown, dimensions: string[], selected = ["visitors","visits","pageviews"]) {
  return { site_id, metrics: selected, date_range: range, dimensions, include: { total_rows: true }, pagination: { limit: 100, offset: 0 } };
}

export function registerTools(server: McpServer, client: PlausibleClient, config: PlausibleConfig): void {
  server.tool("plausible.stats.query", "Run a validated Plausible Stats API v2 query. READ.", { site_id: site, date_range: dateRange, metrics, dimensions: z.array(z.string().min(1).max(300)).max(4).default([]), filters: z.array(filter).max(20).optional(), limit: z.number().int().min(1).max(1000).default(100), offset: z.number().int().min(0).default(0) }, async a => text(await client.query({ site_id:a.site_id, date_range:a.date_range, metrics:a.metrics, dimensions:a.dimensions, filters:a.filters, include:{total_rows:true}, pagination:{limit:a.limit,offset:a.offset} })));
  server.tool("plausible.stats.overview", "Get headline traffic metrics. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,[],["visitors","visits","pageviews","views_per_visit","bounce_rate","visit_duration"]))));
  server.tool("plausible.stats.timeseries", "Get daily traffic trend. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["time:day"]))));
  server.tool("plausible.stats.pages", "Get top pages. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["event:page"],["visitors","pageviews"]))));
  server.tool("plausible.stats.sources", "Get acquisition sources. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["visit:source"],["visitors","visits"]))));
  server.tool("plausible.stats.countries", "Get country breakdown. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["visit:country_name"],["visitors","visits"]))));
  server.tool("plausible.stats.devices", "Get device breakdown. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["visit:device"],["visitors","visits"]))));
  server.tool("plausible.stats.goals", "Get conversion-event breakdown. READ.", { site_id: site, date_range: dateRange.default("30d") }, async a => text(await client.query(q(a.site_id,a.date_range,["event:goal"],["visitors","events"]))));
  server.tool("plausible.stats.realtime", "Get recent five-minute traffic. READ.", { site_id: site }, async a => text(await client.query({ site_id:a.site_id, metrics:["visitors","pageviews"], date_range:[new Date(Date.now()-300000).toISOString(),new Date().toISOString()] })));
  server.tool("plausible.event.pageview", "Record a pageview. WRITE; explicit approval required; disabled by default.", { domain:site, url:safeUrl, user_agent:z.string().min(3).max(1000), forwarded_for:z.string().max(128).optional(), referrer:z.string().url().optional(), props:props.optional(), approved:z.literal(true) }, async a => { requireApproval("plausible.event.pageview",a.approved,config.allowEventWrites); return text(await client.sendEvent({domain:a.domain,name:"pageview",url:a.url,referrer:a.referrer,props:a.props},a.user_agent,a.forwarded_for)); });
  server.tool("plausible.event.custom", "Record a custom event. WRITE; explicit approval required; disabled by default.", { domain:site, name:z.string().min(1).max(300).refine(v=>v!=="pageview"), url:safeUrl, user_agent:z.string().min(3).max(1000), forwarded_for:z.string().max(128).optional(), referrer:z.string().url().optional(), props:props.optional(), interactive:z.boolean().optional(), revenue:z.object({currency:z.string().regex(/^[A-Z]{3}$/),amount:z.union([z.string().regex(/^\d+(\.\d+)?$/),z.number().nonnegative()])}).optional(), approved:z.literal(true) }, async a => { requireApproval("plausible.event.custom",a.approved,config.allowEventWrites); return text(await client.sendEvent({domain:a.domain,name:a.name,url:a.url,referrer:a.referrer,props:a.props,interactive:a.interactive,revenue:a.revenue},a.user_agent,a.forwarded_for)); });
}
