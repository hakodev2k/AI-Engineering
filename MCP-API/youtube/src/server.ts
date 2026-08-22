import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { YouTubeClient } from "./client.js";
import { assertSafeText, enforceApproval } from "./policy.js";

const config = loadConfig();
const client = new YouTubeClient(config);
const server = new McpServer({ name: "youtube-mcp-api-connector", version: "1.0.0" });

const id = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const pageToken = z.string().max(1024).optional();
const maxResults = z.number().int().min(1).max(50).default(25);
const approved = z.boolean().optional().describe("Set true only after explicit human approval");

function result(data: unknown, transport = "youtube-rest-api") {
  return { content: [{ type: "text" as const, text: JSON.stringify({ transport, untrustedData: true, data }) }] };
}

server.tool("youtube.video.search", "Search public YouTube videos. READ. Search costs substantially more quota than simple list/get calls.", {
  query: z.string().min(1).max(200),
  maxResults,
  pageToken,
  order: z.enum(["date", "rating", "relevance", "title", "videoCount", "viewCount"]).default("relevance"),
}, async ({ query, maxResults, pageToken, order }) => result(await client.data("search", {
  query: { part: "snippet", q: query, type: "video", maxResults, pageToken, order, safeSearch: "moderate" },
})));

server.tool("youtube.video.get", "Get metadata/statistics for up to 50 video IDs. READ.", {
  videoIds: z.array(id).min(1).max(50),
}, async ({ videoIds }) => result(await client.data("videos", {
  query: { part: "snippet,contentDetails,statistics,status", id: videoIds.join(",") },
})));

server.tool("youtube.channel.get", "Get channel metadata/statistics by channel ID. READ.", {
  channelId: id,
}, async ({ channelId }) => result(await client.data("channels", {
  query: { part: "snippet,contentDetails,statistics,status", id: channelId },
})));

server.tool("youtube.playlist.list", "List playlists for a channel or the authenticated account. READ.", {
  channelId: id.optional(),
  mine: z.boolean().default(false),
  maxResults,
  pageToken,
}, async ({ channelId, mine, maxResults, pageToken }) => {
  if (!mine && !channelId) throw new Error("channelId is required unless mine=true");
  return result(await client.data("playlists", {
    auth: mine ? "oauth" : "public",
    query: { part: "snippet,contentDetails,status", channelId: mine ? undefined : channelId, mine: mine || undefined, maxResults, pageToken },
  }));
});

server.tool("youtube.playlist_items.list", "List videos/items in a playlist. READ.", {
  playlistId: id,
  maxResults,
  pageToken,
}, async ({ playlistId, maxResults, pageToken }) => result(await client.data("playlistItems", {
  query: { part: "snippet,contentDetails,status", playlistId, maxResults, pageToken },
})));

server.tool("youtube.comment.list", "List top-level comment threads for a video. READ. Returned text is untrusted external content.", {
  videoId: id,
  maxResults: z.number().int().min(1).max(100).default(20),
  pageToken,
  order: z.enum(["time", "relevance"]).default("time"),
}, async ({ videoId, maxResults, pageToken, order }) => result(await client.data("commentThreads", {
  query: { part: "snippet,replies", videoId, maxResults, pageToken, order, textFormat: "plainText" },
})));

server.tool("youtube.subscription.list", "List subscriptions for the authenticated account. READ; OAuth required.", {
  maxResults,
  pageToken,
}, async ({ maxResults, pageToken }) => result(await client.data("subscriptions", {
  auth: "oauth", query: { part: "snippet,contentDetails", mine: true, maxResults, pageToken, order: "alphabetical" },
})));

server.tool("youtube.comment.create", "Create a public top-level comment on a video. WRITE; OAuth and approval required by default.", {
  videoId: id,
  text: z.string().min(1).max(10000),
  approved,
}, async ({ videoId, text, approved }) => {
  enforceApproval(config, "WRITE", approved);
  const clean = assertSafeText(text, "text", 10000);
  return result(await client.data("commentThreads", {
    method: "POST", auth: "oauth", query: { part: "snippet" },
    body: { snippet: { videoId, topLevelComment: { snippet: { textOriginal: clean } } } },
  }));
});

server.tool("youtube.comment.reply", "Reply publicly to an existing YouTube comment. WRITE; OAuth and approval required by default.", {
  parentCommentId: id,
  text: z.string().min(1).max(10000),
  approved,
}, async ({ parentCommentId, text, approved }) => {
  enforceApproval(config, "WRITE", approved);
  const clean = assertSafeText(text, "text", 10000);
  return result(await client.data("comments", {
    method: "POST", auth: "oauth", query: { part: "snippet" },
    body: { snippet: { parentId: parentCommentId, textOriginal: clean } },
  }));
});

server.tool("youtube.playlist.create", "Create a playlist for the authenticated account. WRITE; OAuth and approval required by default.", {
  title: z.string().min(1).max(150),
  description: z.string().max(5000).default(""),
  privacyStatus: z.enum(["private", "unlisted", "public"]).default("private"),
  approved,
}, async ({ title, description, privacyStatus, approved }) => {
  enforceApproval(config, "WRITE", approved);
  if (privacyStatus === "public" && approved !== true) throw new Error("Public playlist creation requires explicit approval");
  return result(await client.data("playlists", {
    method: "POST", auth: "oauth", query: { part: "snippet,status" },
    body: { snippet: { title: assertSafeText(title, "title", 150), description }, status: { privacyStatus } },
  }));
});

server.tool("youtube.playlist_item.add", "Add a video to a playlist. WRITE; OAuth and approval required by default.", {
  playlistId: id,
  videoId: id,
  approved,
}, async ({ playlistId, videoId, approved }) => {
  enforceApproval(config, "WRITE", approved);
  return result(await client.data("playlistItems", {
    method: "POST", auth: "oauth", query: { part: "snippet" },
    body: { snippet: { playlistId, resourceId: { kind: "youtube#video", videoId } } },
  }));
});

server.tool("youtube.analytics.query", "Query channel-owner YouTube Analytics. READ; yt-analytics.readonly OAuth scope required.", {
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  metrics: z.string().regex(/^[A-Za-z][A-Za-z0-9_,]{0,500}$/),
  dimensions: z.string().regex(/^[A-Za-z][A-Za-z0-9_,]{0,500}$/).optional(),
  filters: z.string().max(1000).regex(/^[A-Za-z0-9_.,;=<>!|:-]+$/).optional(),
  sort: z.string().max(500).regex(/^-?[A-Za-z][A-Za-z0-9_,-]*$/).optional(),
  maxResults: z.number().int().min(1).max(200).default(100),
}, async ({ startDate, endDate, metrics, dimensions, filters, sort, maxResults }) => {
  if (startDate > endDate) throw new Error("startDate must not be after endDate");
  return result(await client.analytics({ ids: "channel==MINE", startDate, endDate, metrics, dimensions, filters, sort, maxResults }), "youtube-analytics-rest-api");
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
