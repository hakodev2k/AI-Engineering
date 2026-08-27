import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { MattermostRestClient } from './rest.js';
import { MattermostUpstreamMcp } from './upstream-mcp.js';
import { assertAllowed } from './policy.js';

const id = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/);
const text = z.string().min(1).max(16383);
const approval = z.string().length(64).regex(/^[a-f0-9]+$/).optional();
const config = loadConfig();
const rest = new MattermostRestClient(config);
const upstream = new MattermostUpstreamMcp(config);
const server = new McpServer({ name: 'mattermost-connector', version: '1.0.0' });

function result(data: unknown, transport: 'mcp' | 'rest') {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ transport, data }) }] };
}
function approve(tool: string, token?: string) { assertAllowed(tool, token, config); }

server.registerTool('mattermost.user.me', { description: 'Get the authenticated Mattermost user.', inputSchema: {} }, async () => result(await rest.me(), 'rest'));
server.registerTool('mattermost.team.list', { description: 'List teams visible to the authenticated user.', inputSchema: {} }, async () => result(await rest.teams(), 'rest'));
server.registerTool('mattermost.channel.list', { description: 'List channels visible to the authenticated user in a team.', inputSchema: { team_id: id } }, async ({ team_id }) => result(await rest.channels(team_id), 'rest'));
server.registerTool('mattermost.channel.get', { description: 'Get Mattermost channel metadata.', inputSchema: { channel_id: id } }, async ({ channel_id }) => upstream.enabled ? result(await upstream.call('get_channel_info', { channel_id }), 'mcp') : result(await rest.channel(channel_id), 'rest'));
server.registerTool('mattermost.channel.search', { description: 'Search channels in a team by name or display name.', inputSchema: { team_id: id, term: z.string().min(1).max(128) } }, async ({ team_id, term }) => result(await rest.searchChannels(team_id, term), 'rest'));
server.registerTool('mattermost.post.get', { description: 'Read a post. Official Mattermost MCP is preferred when configured.', inputSchema: { post_id: id, include_thread: z.boolean().default(true) } }, async ({ post_id, include_thread }) => upstream.enabled ? result(await upstream.call('read_post', { post_id, include_thread }), 'mcp') : result(await rest.post(post_id), 'rest'));
server.registerTool('mattermost.post.search', { description: 'Search posts in a team. Official Mattermost MCP is preferred when configured.', inputSchema: { team_id: id, query: z.string().min(1).max(1024), channel_id: id.optional(), limit: z.number().int().min(1).max(100).default(20) } }, async ({ team_id, query, channel_id, limit }) => upstream.enabled ? result(await upstream.call('search_posts', { query, team_id, ...(channel_id ? { channel_id } : {}), limit }), 'mcp') : result(await rest.searchPosts(team_id, query), 'rest'));
server.registerTool('mattermost.post.create', { description: 'Create a Mattermost post or reply. Requires explicit approval.', inputSchema: { channel_id: id, message: text, root_id: id.optional(), approval } }, async ({ channel_id, message, root_id, approval }) => { approve('mattermost.post.create', approval); return upstream.enabled ? result(await upstream.call('create_post', { channel_id, message, ...(root_id ? { root_id } : {}) }), 'mcp') : result(await rest.createPost(channel_id, message, root_id), 'rest'); });
server.registerTool('mattermost.post.update', { description: 'Update a Mattermost post message. Requires explicit approval.', inputSchema: { post_id: id, message: text, approval } }, async ({ post_id, message, approval }) => { approve('mattermost.post.update', approval); return result(await rest.updatePost(post_id, message), 'rest'); });
server.registerTool('mattermost.post.delete', { description: 'Delete a Mattermost post. Disabled by default and requires explicit approval.', inputSchema: { post_id: id, approval } }, async ({ post_id, approval }) => { approve('mattermost.post.delete', approval); await rest.deletePost(post_id); return result({ deleted: true, post_id }, 'rest'); });
server.registerTool('mattermost.reaction.list', { description: 'List reactions on a Mattermost post.', inputSchema: { post_id: id } }, async ({ post_id }) => result(await rest.reactions(post_id), 'rest'));
server.registerTool('mattermost.reaction.add', { description: 'Add a reaction as the authenticated user. Requires explicit approval.', inputSchema: { post_id: id, emoji_name: z.string().min(1).max(64), approval } }, async ({ post_id, emoji_name, approval }) => { approve('mattermost.reaction.add', approval); return result(await rest.addReaction(post_id, emoji_name), 'rest'); });
server.registerTool('mattermost.reaction.remove', { description: 'Remove a reaction by the authenticated user. Requires explicit approval.', inputSchema: { post_id: id, emoji_name: z.string().min(1).max(64), approval } }, async ({ post_id, emoji_name, approval }) => { approve('mattermost.reaction.remove', approval); await rest.removeReaction(post_id, emoji_name); return result({ removed: true, post_id, emoji_name }, 'rest'); });

const transport = new StdioServerTransport();
await server.connect(transport);
process.on('SIGINT', async () => { await upstream.close(); await server.close(); process.exit(0); });
process.on('SIGTERM', async () => { await upstream.close(); await server.close(); process.exit(0); });
