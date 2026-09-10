import { z } from "zod";
import { ImgixClient, buildRenderUrl, signRenderUrl } from "./client.js";
import { requirePermission, type Risk } from "./policy.js";

export const TOOL_NAMES = [
  "imgix.source.list", "imgix.source.get", "imgix.source.search",
  "imgix.asset.list", "imgix.asset.search", "imgix.cache.purge",
  "imgix.render.url.build", "imgix.render.url.sign"
] as const;

const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/);
const page = z.number().int().min(1).max(10000).default(1);
const pageSize = z.number().int().min(1).max(100).default(20);
const query = z.string().trim().min(1).max(200);
const domain = z.string().min(1).max(253).regex(/^[a-z0-9.-]+\.imgix\.net$/i);
const imagePath = z.string().min(1).max(2048).refine(v => !v.includes(".."), "path traversal is not allowed");
const params = z.record(z.union([z.string().max(2048), z.number().finite(), z.boolean()])).default({});
const httpsImgixUrl = z.string().url().refine(v => { const u = new URL(v); return u.protocol === "https:" && u.hostname.endsWith(".imgix.net"); }, "must be an HTTPS imgix.net URL");

type ToolDef = { description: string; risk: Risk; schema: z.ZodTypeAny; run: (input: any, client: ImgixClient) => Promise<unknown> | unknown };

export const tools: Record<string, ToolDef> = {
  "imgix.source.list": { description: "List configured imgix Sources with bounded pagination.", risk: "READ", schema: z.object({ page, pageSize }).strict(), run: (i,c) => c.listSources(i.page, i.pageSize) },
  "imgix.source.get": { description: "Read one imgix Source by source ID.", risk: "READ", schema: z.object({ sourceId: id }).strict(), run: (i,c) => c.getSource(i.sourceId) },
  "imgix.source.search": { description: "Search Source records returned by imgix using a bounded page and a local case-insensitive match; this does not mutate provider data.", risk: "READ", schema: z.object({ query, page, pageSize }).strict(), run: async (i,c) => filterProvider(await c.listSources(i.page, i.pageSize), i.query) },
  "imgix.asset.list": { description: "List Asset Manager assets for a Source with bounded pagination.", risk: "READ", schema: z.object({ sourceId: id, page, pageSize }).strict(), run: (i,c) => c.listAssets(i.sourceId, i.page, i.pageSize) },
  "imgix.asset.search": { description: "Search Asset Manager assets for a Source using imgix's asset query filter.", risk: "READ", schema: z.object({ sourceId: id, query, page, pageSize }).strict(), run: (i,c) => c.listAssets(i.sourceId, i.page, i.pageSize, i.query) },
  "imgix.cache.purge": { description: "Purge a specific rendered asset URL from a Source cache. Requires high-risk enablement and explicit human approval.", risk: "HIGH_RISK", schema: z.object({ sourceId: id, url: httpsImgixUrl, approved: z.literal(true) }).strict(), run: (i,c) => { requirePermission("HIGH_RISK", i.approved); return c.purge(i.sourceId, i.url); } },
  "imgix.render.url.build": { description: "Build a validated HTTPS imgix rendering URL from a render domain, asset path, and explicit URL API parameters.", risk: "READ", schema: z.object({ domain, path: imagePath, params }).strict(), run: i => ({ url: buildRenderUrl(i.domain, i.path, i.params) }) },
  "imgix.render.url.sign": { description: "Sign an imgix rendering URL using IMGIX_SIGNING_TOKEN kept inside the connector. Requires WRITE enablement but never returns the token.", risk: "WRITE", schema: z.object({ url: httpsImgixUrl }).strict(), run: i => { requirePermission("WRITE"); return { url: signRenderUrl(i.url) }; } }
};

export async function executeTool(name: string, input: unknown, client = new ImgixClient()): Promise<unknown> {
  const tool = tools[name];
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  if (tool.risk === "READ") requirePermission("READ");
  const parsed = tool.schema.parse(input);
  const data = await tool.run(parsed, client);
  return { data, meta: { provider: "imgix", untrustedProviderContent: tool.risk === "READ" && name !== "imgix.render.url.build" } };
}

function filterProvider(value: unknown, q: string): unknown {
  const needle = q.toLowerCase();
  if (value && typeof value === "object" && Array.isArray((value as any).data)) {
    const obj = value as any;
    return { ...obj, data: obj.data.filter((x: unknown) => JSON.stringify(x).toLowerCase().includes(needle)) };
  }
  return value;
}
