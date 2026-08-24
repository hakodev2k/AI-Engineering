import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { RedditClient } from './client.js';
import { assertSubredditAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new RedditClient(config);
const server = new McpServer({ name: 'reddit-mcp-connector', version: '1.0.0' });
const subreddit = z.string().min(1).max(100).regex(/^[A-Za-z0-9_]+$/);
const fullname = z.string().regex(/^t[13]_[a-z0-9]+$/i);
const approvalId = z.string().length(64).optional();
const listing = {
  limit: z.number().int().min(1).max(100).optional(),
  after: z.string().max(100).optional()
};
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('reddit.identity.get', 'Get the authenticated Reddit user identity. Requires OAuth identity scope.', {}, async () => out(await client.get('/api/v1/me')));

server.tool('reddit.subreddit.search', 'Search subreddits by name/title. Requires read scope.', {
  query: z.string().min(1).max(200), ...listing
}, async a => out(await client.get('/subreddits/search', { q: a.query, limit: a.limit, after: a.after })));

server.tool('reddit.subreddit.get', 'Get public metadata for one subreddit. Requires read scope.', { subreddit }, async a => {
  assertSubredditAllowed(config, a.subreddit);
  return out(await client.get(`/r/${encodeURIComponent(a.subreddit)}/about`));
});

server.tool('reddit.post.list', 'List posts from a subreddit by hot/new/top/rising. Requires read scope.', {
  subreddit,
  sort: z.enum(['hot', 'new', 'top', 'rising']),
  time: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  ...listing
}, async a => {
  assertSubredditAllowed(config, a.subreddit);
  return out(await client.get(`/r/${encodeURIComponent(a.subreddit)}/${a.sort}`, { t: a.time, limit: a.limit, after: a.after }));
});

server.tool('reddit.post.search', 'Search posts, optionally within one allowed subreddit. Requires read scope.', {
  query: z.string().min(1).max(512),
  subreddit: subreddit.optional(),
  sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
  time: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  ...listing
}, async a => {
  assertSubredditAllowed(config, a.subreddit);
  const path = a.subreddit ? `/r/${encodeURIComponent(a.subreddit)}/search` : '/search';
  return out(await client.get(path, { q: a.query, restrict_sr: Boolean(a.subreddit), sort: a.sort, t: a.time, limit: a.limit, after: a.after }));
});

server.tool('reddit.post.get', 'Get a post by Reddit fullname (t3_*). Requires read scope.', {
  id: z.string().regex(/^t3_[a-z0-9]+$/i)
}, async a => out(await client.get('/api/info', { id: a.id })));

server.tool('reddit.comments.list', 'Read a post and its comment tree by base36 post id. Requires read scope.', {
  subreddit,
  postId: z.string().min(1).max(20).regex(/^[a-z0-9]+$/i),
  sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'qa', 'live']).optional(),
  limit: z.number().int().min(1).max(500).optional()
}, async a => {
  assertSubredditAllowed(config, a.subreddit);
  return out(await client.get(`/r/${encodeURIComponent(a.subreddit)}/comments/${encodeURIComponent(a.postId)}`, { sort: a.sort, limit: a.limit }));
});

server.tool('reddit.comment.create', 'Create a public comment on a post or comment. Requires submit scope and explicit approval.', {
  parent: fullname,
  text: z.string().min(1).max(10000),
  approvalId
}, async a => {
  assertApproval('reddit.comment.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/api/comment', { api_type: 'json', thing_id: a.parent, text: a.text }));
});

server.tool('reddit.post.create', 'Create a public self or link post. Requires submit scope and explicit approval.', {
  subreddit,
  title: z.string().min(1).max(300),
  kind: z.enum(['self', 'link']),
  text: z.string().max(40000).optional(),
  url: z.string().url().max(2048).optional(),
  nsfw: z.boolean().optional(),
  spoiler: z.boolean().optional(),
  approvalId
}, async a => {
  assertSubredditAllowed(config, a.subreddit);
  assertApproval('reddit.post.create', a.approvalId, config.approvalSecret);
  if (a.kind === 'self' && a.url) throw new Error('url is not allowed for self posts');
  if (a.kind === 'link' && !a.url) throw new Error('url is required for link posts');
  return out(await client.post('/api/submit', {
    api_type: 'json', sr: a.subreddit, title: a.title, kind: a.kind,
    text: a.kind === 'self' ? (a.text ?? '') : undefined,
    url: a.kind === 'link' ? a.url : undefined,
    nsfw: a.nsfw ?? false,
    spoiler: a.spoiler ?? false,
    resubmit: true
  }));
});

server.tool('reddit.thing.save', 'Save a post or comment to the authenticated account. Requires save scope and explicit approval.', {
  id: fullname, category: z.string().max(100).optional(), approvalId
}, async a => {
  assertApproval('reddit.thing.save', a.approvalId, config.approvalSecret);
  return out(await client.post('/api/save', { id: a.id, category: a.category }));
});

server.tool('reddit.thing.unsave', 'Remove a saved post or comment from the authenticated account. Requires save scope and explicit approval.', {
  id: fullname, approvalId
}, async a => {
  assertApproval('reddit.thing.unsave', a.approvalId, config.approvalSecret);
  return out(await client.post('/api/unsave', { id: a.id }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
