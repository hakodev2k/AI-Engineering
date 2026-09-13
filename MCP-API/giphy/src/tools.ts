import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GiphyClient } from "./client.js";
import type { GiphyConfig, Rating } from "./config.js";

const rating = z.enum(["g", "pg", "pg-13", "r"]).optional();
const page = { limit: z.number().int().min(1).max(50).default(20), offset: z.number().int().min(0).max(499).default(0) };
const locale = { rating, lang: z.string().min(2).max(10).optional(), country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() };

function text(value: unknown) { return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] }; }
function common(input: Record<string, unknown>, cfg: GiphyConfig) {
  return { ...input, rating: (input.rating as Rating | undefined) ?? cfg.defaultRating };
}

export function registerTools(server: McpServer, client: GiphyClient, cfg: GiphyConfig): void {
  server.tool("giphy.gif.search", "Search GIPHY GIFs. READ; no approval.", { q: z.string().min(1).max(200), ...page, ...locale }, async (a) => text(await client.get("/v1/gifs/search", common(a, cfg))));
  server.tool("giphy.gif.trending", "List trending GIPHY GIFs. READ; no approval.", { ...page, rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/gifs/trending", common(a, cfg))));
  server.tool("giphy.gif.random", "Get a random GIF. READ; no approval.", { tag: z.string().max(200).optional(), rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/gifs/random", common(a, cfg))));
  server.tool("giphy.gif.translate", "Translate a phrase to one GIF. READ; no approval.", { s: z.string().min(1).max(200), rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/gifs/translate", common(a, cfg))));
  server.tool("giphy.gif.get", "Get GIFs by one or more IDs. READ; no approval.", { ids: z.array(z.string().min(1).max(100)).min(1).max(50) }, async ({ ids }) => text(await client.get("/v1/gifs", { ids: ids.join(",") })));
  server.tool("giphy.sticker.search", "Search GIPHY Stickers. READ; no approval.", { q: z.string().min(1).max(200), ...page, ...locale }, async (a) => text(await client.get("/v1/stickers/search", common(a, cfg))));
  server.tool("giphy.sticker.trending", "List trending GIPHY Stickers. READ; no approval.", { ...page, rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/stickers/trending", common(a, cfg))));
  server.tool("giphy.sticker.random", "Get a random Sticker. READ; no approval.", { tag: z.string().max(200).optional(), rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/stickers/random", common(a, cfg))));
  server.tool("giphy.sticker.translate", "Translate a phrase to one Sticker. READ; no approval.", { s: z.string().min(1).max(200), rating, country_code: z.string().length(2).optional(), region: z.string().min(1).max(10).optional() }, async (a) => text(await client.get("/v1/stickers/translate", common(a, cfg))));
  server.tool("giphy.tag.related", "List GIPHY tags related to a term. READ; no approval.", { term: z.string().min(1).max(100) }, async ({ term }) => text(await client.get(`/v1/tags/related/${encodeURIComponent(term)}`, {})));
  server.tool("giphy.search.trending_terms", "List trending GIPHY search terms. READ; no approval.", {}, async () => text(await client.get("/v1/trending/searches", {})));
}
