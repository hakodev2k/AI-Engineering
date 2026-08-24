import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertKeyAllowed, loadConfig } from './config.js';
import { assertDestructiveApproval, assertWriteApproval } from './policy.js';
import { RedisMcpUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new RedisMcpUpstream(config);
const server = new McpServer({ name: 'redis-mcp-connector', version: '1.0.0' });
const key = z.string().min(1).max(1024);
const approvalId = z.string().length(64).optional();
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('redis.key.get', 'Read a Redis string value. READ.', { key }, async a => {
  assertKeyAllowed(config, a.key); return output(await upstream.call('get', { key: a.key }));
});
server.tool('redis.key.type', 'Read Redis key type and TTL. READ.', { key }, async a => {
  assertKeyAllowed(config, a.key); return output(await upstream.call('type', { key: a.key }));
});
server.tool('redis.key.scan', 'Incrementally scan Redis keys without KEYS. READ.', {
  pattern: z.string().min(1).max(1024).default('*'), count: z.number().int().min(1).max(1000).default(100), cursor: z.number().int().min(0).default(0)
}, async a => output(await upstream.call('scan_keys', a)));
server.tool('redis.hash.get', 'Read one Redis hash field. READ.', { name: key, field: z.string().min(1).max(1024) }, async a => {
  assertKeyAllowed(config, a.name); return output(await upstream.call('hget', { name: a.name, key: a.field }));
});
server.tool('redis.hash.get_all', 'Read all fields from a Redis hash. READ.', { name: key }, async a => {
  assertKeyAllowed(config, a.name); return output(await upstream.call('hgetall', { name: a.name }));
});
server.tool('redis.key.set', 'Set a Redis string value. WRITE; explicit approval required.', {
  key, value: z.union([z.string().max(200000), z.number(), z.record(z.string(), z.unknown())]), expirationSeconds: z.number().int().positive().max(31536000).optional(), approvalId
}, async a => {
  assertKeyAllowed(config, a.key); assertWriteApproval(config, 'redis.key.set', a.approvalId);
  return output(await upstream.call('set', { key: a.key, value: a.value, expiration: a.expirationSeconds }));
});
server.tool('redis.hash.set', 'Set one Redis hash field. WRITE; explicit approval required.', {
  name: key, field: z.string().min(1).max(1024), value: z.union([z.string().max(200000), z.number()]), expirationSeconds: z.number().int().positive().max(31536000).optional(), approvalId
}, async a => {
  assertKeyAllowed(config, a.name); assertWriteApproval(config, 'redis.hash.set', a.approvalId);
  return output(await upstream.call('hset', { name: a.name, key: a.field, value: a.value, expire_seconds: a.expirationSeconds }));
});
server.tool('redis.key.expire', 'Change a key TTL. WRITE; explicit approval required.', {
  key, expirationSeconds: z.number().int().positive().max(31536000), approvalId
}, async a => {
  assertKeyAllowed(config, a.key); assertWriteApproval(config, 'redis.key.expire', a.approvalId);
  return output(await upstream.call('expire', { name: a.key, expire_seconds: a.expirationSeconds }));
});
server.tool('redis.key.delete', 'Delete a Redis key. DESTRUCTIVE; disabled by default and requires strong approval.', { key, approvalId }, async a => {
  assertKeyAllowed(config, a.key); assertDestructiveApproval(config, 'redis.key.delete', a.approvalId);
  return output(await upstream.call('delete', { key: a.key }));
});

const shutdown = async () => { await upstream.close(); await server.close(); process.exit(0); };
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
await server.connect(new StdioServerTransport());
