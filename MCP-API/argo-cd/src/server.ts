import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ArgoCdClient } from './client.js';
import { assertAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new ArgoCdClient(config);
const server = new McpServer({ name: 'argo-cd-mcp-connector', version: '1.0.0' });
const name = z.string().min(1).max(253).regex(/^[A-Za-z0-9._-]+$/);
const project = z.string().min(1).max(253).optional();
const appNamespace = z.string().min(1).max(253).optional();
const approvalId = z.string().length(64).optional();
const enc = encodeURIComponent;
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ untrustedProviderData: true, value }) }] });

server.tool('argocd.application.list', 'List Argo CD applications visible to the authenticated identity. READ.', {
  project,
  appNamespace,
  selector: z.string().max(1000).optional(),
  repo: z.string().url().max(2000).optional()
}, async a => {
  assertAllowed(config, undefined, a.project);
  return out(await client.get('/api/v1/applications', { projects: a.project, appNamespace: a.appNamespace, selector: a.selector, repo: a.repo }));
});

server.tool('argocd.application.get', 'Get an Argo CD application including sync and health status. READ.', {
  name,
  project,
  appNamespace,
  refresh: z.enum(['normal', 'hard']).optional()
}, async a => {
  assertAllowed(config, a.name, a.project);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}`, { project: a.project, appNamespace: a.appNamespace, refresh: a.refresh }));
});

server.tool('argocd.application.resource_tree', 'Get the Kubernetes resource tree managed by an application. READ.', {
  name,
  project,
  appNamespace
}, async a => {
  assertAllowed(config, a.name, a.project);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}/resource-tree`, { project: a.project, appNamespace: a.appNamespace }));
});

server.tool('argocd.application.manifests', 'Get generated manifests for an application. READ; provider content is untrusted.', {
  name,
  project,
  appNamespace,
  revision: z.string().max(500).optional()
}, async a => {
  assertAllowed(config, a.name, a.project);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}/manifests`, { project: a.project, appNamespace: a.appNamespace, revision: a.revision }));
});

server.tool('argocd.application.events', 'List Kubernetes events related to an application or managed resource. READ.', {
  name,
  appNamespace,
  resourceNamespace: z.string().max(253).optional(),
  resourceName: z.string().max(253).optional(),
  resourceUID: z.string().max(128).optional()
}, async a => {
  assertAllowed(config, a.name);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}/events`, {
    appNamespace: a.appNamespace,
    resourceNamespace: a.resourceNamespace,
    resourceName: a.resourceName,
    resourceUID: a.resourceUID
  }));
});

server.tool('argocd.application.sync_windows', 'Get sync windows affecting an application. READ.', {
  name,
  project,
  appNamespace
}, async a => {
  assertAllowed(config, a.name, a.project);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}/syncwindows`, { project: a.project, appNamespace: a.appNamespace }));
});

server.tool('argocd.application.revision_metadata', 'Get author/date/tags/message metadata for an application revision. READ.', {
  name,
  revision: z.string().min(1).max(500),
  project,
  appNamespace,
  sourceIndex: z.number().int().min(0).max(100).optional()
}, async a => {
  assertAllowed(config, a.name, a.project);
  return out(await client.get(`/api/v1/applications/${enc(a.name)}/revisions/${enc(a.revision)}/metadata`, {
    project: a.project,
    appNamespace: a.appNamespace,
    sourceIndex: a.sourceIndex
  }));
});

server.tool('argocd.project.list', 'List Argo CD projects. READ.', {}, async () => out(await client.get('/api/v1/projects')));

server.tool('argocd.project.get', 'Get one Argo CD project. READ.', { name }, async a => {
  assertAllowed(config, undefined, a.name);
  return out(await client.get(`/api/v1/projects/${enc(a.name)}`));
});

server.tool('argocd.repository.list', 'List configured repositories; Argo CD redacts stored credentials. READ.', {
  repo: z.string().url().max(2000).optional(),
  project
}, async a => {
  assertAllowed(config, undefined, a.project);
  return out(await client.get('/api/v1/repositories', { repo: a.repo, project: a.project }));
});

server.tool('argocd.cluster.list', 'List clusters visible to the authenticated identity; Argo CD redacts credentials. READ.', {}, async () => out(await client.get('/api/v1/clusters')));

server.tool('argocd.application.sync', 'Synchronize an application to its desired state. HIGH_RISK deployment action; explicit approval required.', {
  name,
  project,
  appNamespace,
  revision: z.string().max(500).optional(),
  prune: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  syncOptions: z.array(z.string().min(1).max(500)).max(50).optional(),
  approvalId
}, async a => {
  assertAllowed(config, a.name, a.project);
  assertApproval('argocd.application.sync', a.approvalId, config.approvalSecret);
  return out(await client.post(`/api/v1/applications/${enc(a.name)}/sync`, {
    appNamespace: a.appNamespace,
    project: a.project,
    revision: a.revision,
    prune: a.prune ?? false,
    dryRun: a.dryRun ?? false,
    syncOptions: a.syncOptions ? { items: a.syncOptions } : undefined
  }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
