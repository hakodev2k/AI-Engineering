import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SpotifyTokenProvider } from './auth.js';
import { SpotifyClient } from './client.js';
import { loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const tokens = new SpotifyTokenProvider(config);
const client = new SpotifyClient(config, tokens);
const server = new McpServer({ name: 'spotify-mcp-connector', version: '1.0.0' });

const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9]+$/);
const market = z.string().length(2).regex(/^[A-Z]{2}$/).optional();
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('spotify.catalog.search', 'Search Spotify catalog metadata. READ. Spotify content must not be used to train ML/AI models.', {
  query: z.string().min(1).max(500),
  types: z.array(z.enum(['album', 'artist', 'playlist', 'track', 'show', 'episode', 'audiobook'])).min(1).max(7),
  market,
  limit: z.number().int().min(1).max(10).optional(),
  offset: z.number().int().min(0).max(1000).optional()
}, async a => out(await client.get('/search', { q: a.query, type: a.types.join(','), market: a.market, limit: a.limit, offset: a.offset })));

server.tool('spotify.track.get', 'Get Spotify track metadata. READ.', { trackId: id, market }, async a =>
  out(await client.get(`/tracks/${encodeURIComponent(a.trackId)}`, { market: a.market })));

server.tool('spotify.artist.get', 'Get Spotify artist metadata. READ.', { artistId: id }, async a =>
  out(await client.get(`/artists/${encodeURIComponent(a.artistId)}`)));

server.tool('spotify.album.get', 'Get Spotify album metadata. READ.', { albumId: id, market }, async a =>
  out(await client.get(`/albums/${encodeURIComponent(a.albumId)}`, { market: a.market })));

server.tool('spotify.user.me', 'Get the current authenticated Spotify user profile. READ.', {}, async () =>
  out(await client.get('/me')));

server.tool('spotify.user.top', 'Get the current user top artists or tracks. READ; requires user-top-read.', {
  type: z.enum(['artists', 'tracks']),
  timeRange: z.enum(['short_term', 'medium_term', 'long_term']).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(1000).optional()
}, async a => out(await client.get(`/me/top/${a.type}`, { time_range: a.timeRange, limit: a.limit, offset: a.offset })));

server.tool('spotify.playlist.list_mine', 'List playlists owned or followed by the current user. READ.', {
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(1000).optional()
}, async a => out(await client.get('/me/playlists', { limit: a.limit, offset: a.offset })));

server.tool('spotify.playlist.get', 'Get playlist metadata. READ.', { playlistId: id, market }, async a =>
  out(await client.get(`/playlists/${encodeURIComponent(a.playlistId)}`, { market: a.market })));

server.tool('spotify.playlist.items', 'List items in a playlist accessible to the current user. READ.', {
  playlistId: id,
  market,
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(100000).optional()
}, async a => out(await client.get(`/playlists/${encodeURIComponent(a.playlistId)}/items`, { market: a.market, limit: a.limit, offset: a.offset })));

server.tool('spotify.playlist.create', 'Create a playlist for the current user. WRITE; explicit approval required. Public playlists are published on the user profile.', {
  name: z.string().min(1).max(100),
  public: z.boolean().optional(),
  collaborative: z.boolean().optional(),
  description: z.string().max(300).optional(),
  approvalId
}, async a => {
  assertApproval('spotify.playlist.create', a.approvalId, config, 'WRITE');
  if (a.collaborative && a.public !== false) throw new Error('Collaborative playlists must be private (public=false)');
  return out(await client.post('/me/playlists', { name: a.name, public: a.public ?? false, collaborative: a.collaborative ?? false, description: a.description ?? '' }));
});

const spotifyUri = z.string().min(1).max(300).regex(/^spotify:(track|episode):[A-Za-z0-9]+$/);
server.tool('spotify.playlist.add_items', 'Add tracks or episodes to a playlist. WRITE; explicit approval required.', {
  playlistId: id,
  uris: z.array(spotifyUri).min(1).max(100),
  position: z.number().int().min(0).max(100000).optional(),
  approvalId
}, async a => {
  assertApproval('spotify.playlist.add_items', a.approvalId, config, 'WRITE');
  return out(await client.post(`/playlists/${encodeURIComponent(a.playlistId)}/items`, { uris: a.uris, position: a.position }));
});

server.tool('spotify.playlist.remove_items', 'Remove tracks or episodes from a playlist. DESTRUCTIVE; disabled by default and requires explicit approval.', {
  playlistId: id,
  uris: z.array(spotifyUri).min(1).max(100),
  snapshotId: z.string().min(1).max(200).optional(),
  approvalId
}, async a => {
  assertApproval('spotify.playlist.remove_items', a.approvalId, config, 'DESTRUCTIVE');
  return out(await client.delete(`/playlists/${encodeURIComponent(a.playlistId)}/items`, {
    items: a.uris.map(uri => ({ uri })),
    ...(a.snapshotId ? { snapshot_id: a.snapshotId } : {})
  }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
