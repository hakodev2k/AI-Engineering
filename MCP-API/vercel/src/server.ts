import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { VercelClient } from './client.js';
import { assertProjectAllowed, loadConfig } from './config.js';
import { VercelMcp } from './mcp.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const api = new VercelClient(config);
const upstreamMcp = new VercelMcp(config);
const server = new McpServer({ name: 'vercel-mcp-connector', version: '1.0.0' });
const project = z.string().min(1).max(150).regex(/^[A-Za-z0-9._-]+$/);
const approvalId = z.string().length(64).optional();
const enc = encodeURIComponent;
const out = (v: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(v) }] });

server.tool('vercel.project.list', 'List Vercel projects. Uses official Vercel MCP when configured and available, otherwise REST.', { limit: z.number().int().min(1).max(100).optional(), search: z.string().max(200).optional() }, async a => {
  const mcp = await upstreamMcp.tryCall('project.list', a); if (mcp !== undefined) return out(mcp);
  return out(await api.get('/v9/projects', { limit: a.limit, search: a.search }));
});
server.tool('vercel.project.get', 'Get a Vercel project.', { project }, async a => {
  assertProjectAllowed(config, a.project);
  const mcp = await upstreamMcp.tryCall('project.get', { projectId: a.project, project: a.project }); if (mcp !== undefined) return out(mcp);
  return out(await api.get(`/v9/projects/${enc(a.project)}`));
});
server.tool('vercel.deployment.list', 'List deployments, optionally filtered by project or target.', { project: project.optional(), target: z.enum(['production','preview']).optional(), limit: z.number().int().min(1).max(100).optional(), since: z.number().int().nonnegative().optional() }, async a => {
  assertProjectAllowed(config, a.project);
  const mcp = await upstreamMcp.tryCall('deployment.list', a); if (mcp !== undefined) return out(mcp);
  return out(await api.get('/v6/deployments', { projectId: a.project, target: a.target, limit: a.limit, since: a.since }));
});
server.tool('vercel.deployment.get', 'Get deployment metadata by deployment ID or URL.', { idOrUrl: z.string().min(1).max(300) }, async a => {
  const mcp = await upstreamMcp.tryCall('deployment.get', a); if (mcp !== undefined) return out(mcp);
  return out(await api.get(`/v13/deployments/${enc(a.idOrUrl)}`));
});
server.tool('vercel.deployment.logs', 'Get bounded deployment/build events. Uses Vercel MCP first when configured.', { idOrUrl: z.string().min(1).max(300), limit: z.number().int().min(1).max(500).optional(), since: z.number().int().nonnegative().optional(), until: z.number().int().nonnegative().optional() }, async a => {
  const mcp = await upstreamMcp.tryCall('deployment.logs', a); if (mcp !== undefined) return out(mcp);
  return out(await api.get(`/v3/deployments/${enc(a.idOrUrl)}/events`, { limit: a.limit ?? 100, since: a.since, until: a.until, direction: 'backward', follow: 0 }));
});
server.tool('vercel.deployment.create', 'Create a deployment from a connected Git repository. Requires approval.', { project, name: z.string().min(1).max(100).optional(), target: z.enum(['production','preview']).optional(), gitSource: z.object({ type: z.enum(['github','gitlab','bitbucket']), repoId: z.union([z.string(), z.number()]), ref: z.string().min(1).max(255) }), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.deployment.create', a.approvalId, config.approvalSecret);
  return out(await api.post('/v13/deployments', { name: a.name ?? a.project, project: a.project, target: a.target, gitSource: a.gitSource }));
});
server.tool('vercel.deployment.cancel', 'Cancel an in-progress deployment. HIGH_RISK; requires approval.', { id: z.string().min(1).max(200), approvalId }, async a => {
  assertApproval('vercel.deployment.cancel', a.approvalId, config.approvalSecret);
  return out(await api.patch(`/v12/deployments/${enc(a.id)}/cancel`, {}));
});
server.tool('vercel.environment.list', 'List project environment variables. Sensitive values may be redacted by Vercel.', { project }, async a => {
  assertProjectAllowed(config, a.project); return out(await api.get(`/v9/projects/${enc(a.project)}/env`));
});
const envTarget = z.array(z.enum(['production','preview','development'])).min(1).max(3);
server.tool('vercel.environment.create', 'Create a project environment variable. Requires approval.', { project, key: z.string().min(1).max(256), value: z.string().max(65536), target: envTarget, type: z.enum(['plain','encrypted','sensitive']).optional(), gitBranch: z.string().max(255).optional(), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.environment.create', a.approvalId, config.approvalSecret);
  return out(await api.post(`/v10/projects/${enc(a.project)}/env`, { key: a.key, value: a.value, target: a.target, type: a.type ?? 'encrypted', gitBranch: a.gitBranch }, { upsert: false }));
});
server.tool('vercel.environment.update', 'Update an environment variable by ID. Requires approval.', { project, id: z.string().min(1).max(200), value: z.string().max(65536).optional(), target: envTarget.optional(), type: z.enum(['plain','encrypted','sensitive']).optional(), gitBranch: z.string().max(255).nullable().optional(), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.environment.update', a.approvalId, config.approvalSecret);
  return out(await api.patch(`/v9/projects/${enc(a.project)}/env/${enc(a.id)}`, { value: a.value, target: a.target, type: a.type, gitBranch: a.gitBranch }));
});
server.tool('vercel.environment.delete', 'Delete an environment variable by ID. DESTRUCTIVE; requires approval.', { project, id: z.string().min(1).max(200), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.environment.delete', a.approvalId, config.approvalSecret);
  return out(await api.delete(`/v9/projects/${enc(a.project)}/env/${enc(a.id)}`));
});
server.tool('vercel.domain.list', 'List domains assigned to a project.', { project, limit: z.number().int().min(1).max(100).optional() }, async a => {
  assertProjectAllowed(config, a.project); return out(await api.get(`/v9/projects/${enc(a.project)}/domains`, { limit: a.limit }));
});
server.tool('vercel.domain.add', 'Add a domain to a project. Requires approval.', { project, domain: z.string().min(3).max(253), gitBranch: z.string().max(255).optional(), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.domain.add', a.approvalId, config.approvalSecret);
  return out(await api.post(`/v10/projects/${enc(a.project)}/domains`, { name: a.domain, gitBranch: a.gitBranch }));
});
server.tool('vercel.domain.verify', 'Attempt verification of a project domain. Requires approval.', { project, domain: z.string().min(3).max(253), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.domain.verify', a.approvalId, config.approvalSecret);
  return out(await api.post(`/v9/projects/${enc(a.project)}/domains/${enc(a.domain)}/verify`, {}));
});
server.tool('vercel.domain.remove', 'Remove a project domain. DESTRUCTIVE; requires approval.', { project, domain: z.string().min(3).max(253), approvalId }, async a => {
  assertProjectAllowed(config, a.project); assertApproval('vercel.domain.remove', a.approvalId, config.approvalSecret);
  return out(await api.delete(`/v9/projects/${enc(a.project)}/domains/${enc(a.domain)}`));
});

const shutdown = () => { void Promise.allSettled([upstreamMcp.close(), server.close()]).then(() => process.exit(0)); };
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
