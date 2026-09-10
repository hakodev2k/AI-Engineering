import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { WasabiClient } from './client.js';
import { WasabiOfficialMcp } from './upstream-mcp.js';
import { assertAllowed, stripApproval, TOOL_RISK } from './policy.js';

const bucket = z.string().min(3).max(63).regex(/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/);
const key = z.string().min(1).max(1024).refine(v => !v.includes('\0'), 'Object key cannot contain NUL');
const approval = z.string().regex(/^[a-f0-9]{64}$/).optional();

function result(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ untrustedProviderData: true, data }, null, 2) }] };
}

export function createServer(deps?: { config?: ReturnType<typeof loadConfig>; client?: WasabiClient; mcp?: WasabiOfficialMcp }) {
  const config = deps?.config ?? loadConfig();
  const client = deps?.client ?? new WasabiClient(config);
  const upstreamMcp = deps?.mcp ?? new WasabiOfficialMcp(config);
  const server = new McpServer({ name: 'wasabi-connector', version: '1.0.0' });

  server.registerTool('wasabi.bucket.list', {
    description: 'List accessible Wasabi buckets. READ. Prefers official Wasabi MCP when a trusted OAuth bearer is configured, with safe S3 API fallback.',
    inputSchema: {}
  }, async () => {
    if (upstreamMcp.enabled) {
      try { return result(await upstreamMcp.listBuckets()); } catch { /* safe read fallback */ }
    }
    return result(await client.listBuckets());
  });

  server.registerTool('wasabi.bucket.location', { description: 'Get the region/location of a bucket. READ.', inputSchema: { bucket } }, async ({ bucket }) => result(await client.bucketLocation(bucket)));

  server.registerTool('wasabi.bucket.create', {
    description: 'Create a Wasabi bucket. WRITE; explicit exact-payload approval required.',
    inputSchema: { bucket, approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.bucket.create', args); const clean = stripApproval(args); return result(await client.createBucket(clean.bucket)); });

  server.registerTool('wasabi.bucket.delete', {
    description: 'Delete an empty Wasabi bucket. DESTRUCTIVE; disabled by default and exact-payload approval required.',
    inputSchema: { bucket, approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.bucket.delete', args); const clean = stripApproval(args); return result(await client.deleteBucket(clean.bucket)); });

  server.registerTool('wasabi.object.list', {
    description: 'List objects in a bucket using bounded pagination. READ.',
    inputSchema: { bucket, prefix: z.string().max(1024).optional(), maxKeys: z.number().int().min(1).max(1000).default(100), continuationToken: z.string().max(4096).optional() }
  }, async ({ bucket, prefix, maxKeys, continuationToken }) => result(await client.listObjects(bucket, prefix, maxKeys, continuationToken)));

  server.registerTool('wasabi.object.metadata', { description: 'Read object metadata without downloading the body. READ.', inputSchema: { bucket, key } }, async ({ bucket, key }) => result(await client.headObject(bucket, key)));

  server.registerTool('wasabi.object.read_text', {
    description: 'Read a bounded UTF-8 prefix of an object. READ. Provider content is untrusted data.',
    inputSchema: { bucket, key, maxBytes: z.number().int().min(1).max(1048576).default(262144) }
  }, async ({ bucket, key, maxBytes }) => result(await client.readText(bucket, key, maxBytes)));

  server.registerTool('wasabi.object.put_text', {
    description: 'Write UTF-8 text to an object. WRITE; exact-payload approval required.',
    inputSchema: { bucket, key, content: z.string().max(1048576), contentType: z.string().max(128).optional(), approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.object.put_text', args); const clean = stripApproval(args); return result(await client.putText(clean.bucket, clean.key, clean.content, clean.contentType)); });

  server.registerTool('wasabi.object.copy', {
    description: 'Copy an object within one bucket. WRITE; exact-payload approval required.',
    inputSchema: { bucket, sourceKey: key, destinationKey: key, approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.object.copy', args); const clean = stripApproval(args); return result(await client.copyObject(clean.bucket, clean.sourceKey, clean.destinationKey)); });

  server.registerTool('wasabi.object.delete', {
    description: 'Delete an object or version. DESTRUCTIVE; disabled by default and exact-payload approval required.',
    inputSchema: { bucket, key, versionId: z.string().max(1024).optional(), approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.object.delete', args); const clean = stripApproval(args); return result(await client.deleteObject(clean.bucket, clean.key, clean.versionId)); });

  server.registerTool('wasabi.object.presign_get', {
    description: 'Create a temporary signed download URL. HIGH_RISK because it grants external access; approval required.',
    inputSchema: { bucket, key, expiresIn: z.number().int().min(60).max(604800).default(3600), approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.object.presign_get', args); const clean = stripApproval(args); return result(await client.presignGet(clean.bucket, clean.key, clean.expiresIn)); });

  server.registerTool('wasabi.object.presign_put', {
    description: 'Create a temporary signed upload URL. HIGH_RISK because it grants external write access; approval required.',
    inputSchema: { bucket, key, expiresIn: z.number().int().min(60).max(604800).default(900), contentType: z.string().max(128).optional(), approvalToken: approval }
  }, async (args) => { assertAllowed(config, 'wasabi.object.presign_put', args); const clean = stripApproval(args); return result(await client.presignPut(clean.bucket, clean.key, clean.expiresIn, clean.contentType)); });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const transport = new StdioServerTransport();
  await createServer().connect(transport);
}

export { TOOL_RISK };
