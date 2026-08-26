import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, resolveScope } from './config.js';
import { assertAllowed } from './policy.js';
import { DopplerRestClient } from './rest.js';
import { DopplerMcpClient } from './mcp.js';

const cfg = loadConfig();
const rest = new DopplerRestClient(cfg);
const upstream = new DopplerMcpClient(cfg);
const server = new McpServer({ name: 'doppler-mcp-api-connector', version: '1.0.0' });

const slug = z.string().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/);
const approvalId = z.string().length(64).optional();
const out = (data: unknown, sensitive = false) => ({
  content: [{ type: 'text' as const, text: JSON.stringify({ source: 'doppler', untrusted: true, sensitive, data }) }]
});
const requireProject = (project?: string) => {
  const scope = resolveScope(cfg, project);
  if (!scope.project) throw new Error('project is required unless DOPPLER_PROJECT is configured');
  return scope.project;
};
const requireConfig = (project?: string, config?: string) => {
  const scope = resolveScope(cfg, project, config);
  if (!scope.project) throw new Error('project is required unless DOPPLER_PROJECT is configured');
  if (!scope.config) throw new Error('config is required unless DOPPLER_CONFIG is configured');
  return { project: scope.project, config: scope.config };
};

server.tool('doppler.project.list', 'List Doppler projects accessible to the configured identity. READ.', {
  page: z.number().int().min(1).max(10000).optional(),
  perPage: z.number().int().min(1).max(100).optional()
}, async a => {
  assertAllowed(cfg, 'doppler.project.list');
  const mcp = await upstream.tryCall('projects_list', { page: a.page, per_page: a.perPage });
  return out(mcp ?? await rest.get('/projects', { page: a.page, per_page: a.perPage }));
});

server.tool('doppler.project.get', 'Get metadata for one Doppler project. READ.', { project: slug.optional() }, async a => {
  assertAllowed(cfg, 'doppler.project.get');
  const project = requireProject(a.project);
  const mcp = await upstream.tryCall('projects_get', { project });
  return out(mcp ?? await rest.get('/projects/project', { project }));
});

server.tool('doppler.config.list', 'List configs in one Doppler project. READ.', {
  project: slug.optional(),
  page: z.number().int().min(1).max(10000).optional(),
  perPage: z.number().int().min(1).max(100).optional()
}, async a => {
  assertAllowed(cfg, 'doppler.config.list');
  const project = requireProject(a.project);
  const mcp = await upstream.tryCall('configs_list', { project, page: a.page, per_page: a.perPage });
  return out(mcp ?? await rest.get('/configs', { project, page: a.page, per_page: a.perPage }));
});

server.tool('doppler.config.get', 'Get metadata for one Doppler config. READ.', {
  project: slug.optional(), config: slug.optional()
}, async a => {
  assertAllowed(cfg, 'doppler.config.get');
  const scope = requireConfig(a.project, a.config);
  const mcp = await upstream.tryCall('configs_get', scope);
  return out(mcp ?? await rest.get('/configs/config', scope));
});

server.tool('doppler.secret.names', 'List secret names without intentionally requesting secret values. READ.', {
  project: slug.optional(), config: slug.optional(), includeManagedSecrets: z.boolean().optional()
}, async a => {
  assertAllowed(cfg, 'doppler.secret.names');
  const scope = requireConfig(a.project, a.config);
  return out(await rest.get('/configs/config/secrets/names', {
    ...scope, include_managed_secrets: a.includeManagedSecrets
  }));
});

server.tool('doppler.secret.list', 'Read secret values from one config. HIGH_RISK sensitive-data access; explicit approval required.', {
  project: slug.optional(), config: slug.optional(),
  names: z.array(slug).min(1).max(100).optional(),
  includeManagedSecrets: z.boolean().optional(),
  approvalId
}, async a => {
  assertAllowed(cfg, 'doppler.secret.list', a.approvalId);
  const scope = requireConfig(a.project, a.config);
  const args = { ...scope, secrets: a.names?.join(','), include_managed_secrets: a.includeManagedSecrets };
  const mcp = await upstream.tryCall('secrets_list', args);
  return out(mcp ?? await rest.get('/configs/config/secrets', args), true);
});

server.tool('doppler.secret.get', 'Read one secret value. HIGH_RISK sensitive-data access; explicit approval required.', {
  project: slug.optional(), config: slug.optional(), name: slug, approvalId
}, async a => {
  assertAllowed(cfg, 'doppler.secret.get', a.approvalId);
  const scope = requireConfig(a.project, a.config);
  const args = { ...scope, name: a.name };
  const mcp = await upstream.tryCall('secrets_get', args);
  return out(mcp ?? await rest.get('/configs/config/secret', args), true);
});

server.tool('doppler.secret.download', 'Download selected secrets as JSON. HIGH_RISK sensitive-data access; explicit approval required.', {
  project: slug.optional(), config: slug.optional(), names: z.array(slug).min(1).max(100).optional(), approvalId
}, async a => {
  assertAllowed(cfg, 'doppler.secret.download', a.approvalId);
  const scope = requireConfig(a.project, a.config);
  const args = { ...scope, format: 'json', secrets: a.names?.join(',') };
  const mcp = await upstream.tryCall('secrets_download', args);
  return out(mcp ?? await rest.get('/configs/config/secrets/download', args), true);
});

server.tool('doppler.secret.update', 'Create or update named secrets in one config. HIGH_RISK write; explicit approval required; disabled in read-only mode.', {
  project: slug.optional(), config: slug.optional(),
  secrets: z.record(slug, z.string().max(51200)).refine(v => Object.keys(v).length > 0 && Object.keys(v).length <= 100, 'Provide 1-100 secrets'),
  approvalId
}, async a => {
  assertAllowed(cfg, 'doppler.secret.update', a.approvalId);
  const scope = requireConfig(a.project, a.config);
  const payload = { ...scope, secrets: a.secrets };
  const mcp = await upstream.tryCall('secrets_update', payload);
  return out(mcp ?? await rest.post('/configs/config/secrets', payload), true);
});

const shutdown = () => { void Promise.allSettled([server.close(), upstream.close()]).then(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
