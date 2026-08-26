import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { BackblazeClient } from './client.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const config = loadConfig();
const client = new BackblazeClient(config);
const server = new McpServer({ name: 'backblaze-b2-mcp-connector', version: '1.0.0' });

const bucket = z.string().min(6).max(63).regex(/^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/);
const key = z.string().min(1).max(1024).refine(v => !v.includes('\0'), 'NUL not allowed');
const prefix = z.string().max(1024).optional().default('');
const versionId = z.string().min(1).max(200).optional();
const approval = z.string().length(64).optional();
const expiresIn = z.number().int().min(60).max(604800).default(900);
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).filter(([,v]) => v !== undefined).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function approve(tool: string, args: Record<string, unknown>) {
  const clean = { ...args };
  const token = typeof clean.approval === 'string' ? clean.approval : undefined;
  delete clean.approval;
  assertApproval(config, tool, canonical(clean), token);
}

server.tool('backblaze.bucket.list', 'List accessible Backblaze B2 buckets. READ.', {}, async () => out({ risk: TOOL_POLICY['backblaze.bucket.list'].risk, buckets: await client.listBuckets() }));

server.tool('backblaze.bucket.head', 'Check one bucket and return basic metadata. READ.', { bucket }, async a => out(await client.headBucket(a.bucket)));

server.tool('backblaze.object.list', 'List objects using ListObjectsV2 with bounded pagination. READ.', {
  bucket, prefix, continuationToken: z.string().max(4096).optional(), maxKeys: z.number().int().min(1).max(1000).default(100)
}, async a => out(await client.listObjects(a.bucket, a.prefix, a.continuationToken, a.maxKeys)));

server.tool('backblaze.object.version.list', 'List object versions and delete markers. READ.', {
  bucket, prefix, keyMarker: z.string().max(1024).optional(), versionIdMarker: z.string().max(200).optional(), maxKeys: z.number().int().min(1).max(1000).default(100)
}, async a => out(await client.listVersions(a.bucket, a.prefix, a.keyMarker, a.versionIdMarker, a.maxKeys)));

server.tool('backblaze.object.head', 'Get object metadata without downloading content. READ.', { bucket, key, versionId }, async a => out(await client.headObject(a.bucket, a.key, a.versionId)));

server.tool('backblaze.object.read_text', 'Read a UTF-8 text object up to B2_MAX_READ_BYTES. Returned provider content is marked untrusted. READ.', { bucket, key, versionId }, async a => out(await client.readText(a.bucket, a.key, a.versionId)));

server.tool('backblaze.object.presign_download', 'Generate a short-lived signed download URL. READ; URL is a bearer capability and should be handled as sensitive.', { bucket, key, versionId, expiresIn }, async a => out(await client.presignDownload(a.bucket, a.key, a.expiresIn, a.versionId)));

server.tool('backblaze.object.presign_upload', 'Generate a short-lived signed PUT upload URL. WRITE; explicit approval required by default.', {
  bucket, key, contentType: z.string().min(1).max(255).optional(), expiresIn, approval
}, async a => { approve('backblaze.object.presign_upload', a); return out(await client.presignUpload(a.bucket, a.key, a.expiresIn, a.contentType)); });

server.tool('backblaze.object.write_text', 'Upload UTF-8 text to an object. WRITE; explicit approval required by default.', {
  bucket, key, text: z.string().max(1_048_576), contentType: z.string().min(1).max(255).default('text/plain; charset=utf-8'), approval
}, async a => { approve('backblaze.object.write_text', a); return out(await client.writeText(a.bucket, a.key, a.text, a.contentType)); });

server.tool('backblaze.object.copy', 'Copy an existing object to a new allowed bucket/key. WRITE; explicit approval required by default.', {
  sourceBucket: bucket, sourceKey: key, destinationBucket: bucket, destinationKey: key, approval
}, async a => { approve('backblaze.object.copy', a); return out(await client.copyObject(a.sourceBucket, a.sourceKey, a.destinationBucket, a.destinationKey)); });

server.tool('backblaze.object.delete', 'Delete an object by name or a specific version. DESTRUCTIVE; always requires explicit approval.', {
  bucket, key, versionId, approval
}, async a => { approve('backblaze.object.delete', a); return out(await client.deleteObject(a.bucket, a.key, a.versionId)); });

const transport = new StdioServerTransport();
await server.connect(transport);
