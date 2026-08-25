import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CloudinaryClient } from './client.js';
import { loadConfig } from './config.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const cfg = loadConfig();
const client = new CloudinaryClient(cfg);
const server = new McpServer({ name: 'cloudinary-connector', version: '1.0.0' });
const result = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ data, untrusted_provider_content: true }) }] });
const resourceType = z.enum(['image','video','raw']).default('image');
const deliveryType = z.enum(['upload','authenticated','private','fetch']).default('upload');
const approval = z.string().min(64).max(128).optional();

server.tool('cloudinary.asset.list', 'List Cloudinary assets with bounded pagination.', { resourceType, type: deliveryType, maxResults: z.number().int().min(1).max(100).default(50), nextCursor: z.string().max(2048).optional() }, async a => result(await client.listAssets(a)));
server.tool('cloudinary.asset.get', 'Get metadata for one asset.', { publicId: z.string().min(1).max(1024), resourceType, type: deliveryType }, async a => result(await client.getAsset(a.publicId, a.resourceType, a.type)));
server.tool('cloudinary.asset.search', 'Search assets using Cloudinary Search API expression syntax.', { expression: z.string().min(1).max(4096), maxResults: z.number().int().min(1).max(100).default(50), nextCursor: z.string().max(2048).optional() }, async a => result(await client.searchAssets(a.expression, a.maxResults, a.nextCursor)));
server.tool('cloudinary.folder.list', 'List root asset folders.', {}, async () => result(await client.listFolders()));
server.tool('cloudinary.tag.list', 'List tags for a resource type.', { resourceType, maxResults: z.number().int().min(1).max(500).default(100), nextCursor: z.string().max(2048).optional() }, async a => result(await client.listTags(a.resourceType, a.maxResults, a.nextCursor)));
server.tool('cloudinary.usage.get', 'Get current account usage and Admin API utilization metadata.', {}, async () => result(await client.usage()));
server.tool('cloudinary.transformation.url', 'Generate a secure Cloudinary delivery URL without modifying provider state.', { publicId: z.string().min(1).max(1024), resourceType, transformation: z.array(z.record(z.union([z.string(),z.number(),z.boolean()]))).max(20).optional() }, async a => result({ url: client.buildUrl(a.publicId, a.resourceType, a.transformation) }));

server.tool('cloudinary.asset.upload', 'Upload a media asset. Requires explicit approval.', { file: z.string().min(1).max(4096), publicId: z.string().min(1).max(1024).optional(), folder: z.string().max(1024).optional(), resourceType, tags: z.array(z.string().min(1).max(255)).max(100).optional(), approvalId: approval }, async a => { assertApproval('cloudinary.asset.upload', a.approvalId, cfg.approvalSecret); return result(await client.upload(a.file, { public_id: a.publicId, folder: a.folder, resource_type: a.resourceType, tags: a.tags, overwrite: false })); });
server.tool('cloudinary.asset.update', 'Update asset tags/context via explicit operation. Requires explicit approval.', { publicId: z.string().min(1).max(1024), resourceType, type: deliveryType, tags: z.array(z.string().min(1).max(255)).max(100).optional(), context: z.record(z.string().max(1024)).optional(), approvalId: approval }, async a => { assertApproval('cloudinary.asset.update', a.approvalId, cfg.approvalSecret); if (!a.tags && !a.context) throw new Error('At least one update field is required'); return result(await client.updateAsset(a.publicId, { tags: a.tags, context: a.context }, a.resourceType, a.type)); });
server.tool('cloudinary.asset.rename', 'Rename an asset public ID without overwrite. Requires explicit approval.', { fromPublicId: z.string().min(1).max(1024), toPublicId: z.string().min(1).max(1024), resourceType, type: deliveryType, approvalId: approval }, async a => { assertApproval('cloudinary.asset.rename', a.approvalId, cfg.approvalSecret); if (a.fromPublicId === a.toPublicId) throw new Error('Source and destination public IDs must differ'); return result(await client.renameAsset(a.fromPublicId, a.toPublicId, a.resourceType, a.type)); });
server.tool('cloudinary.asset.delete', 'Permanently delete one asset and invalidate CDN caches. Requires explicit approval.', { publicId: z.string().min(1).max(1024), resourceType, type: deliveryType, approvalId: approval, confirmPublicId: z.string().min(1).max(1024) }, async a => { assertApproval('cloudinary.asset.delete', a.approvalId, cfg.approvalSecret); if (a.confirmPublicId !== a.publicId) throw new Error('confirmPublicId must exactly match publicId'); return result(await client.deleteAsset(a.publicId, a.resourceType, a.type)); });

export { server, TOOL_POLICY };
if (process.env.NODE_ENV !== 'test') await server.connect(new StdioServerTransport());
