import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertTargetAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { DockerHubUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new DockerHubUpstream(config);
const server = new McpServer({ name: 'docker-hub-mcp-connector', version: '1.0.0' });

const namespace = z.string().min(1).max(255).regex(/^[a-z0-9][a-z0-9_.-]*$/i);
const repository = z.string().min(2).max(255).regex(/^[a-z0-9][a-z0-9_-]*$/);
const tag = z.string().min(1).max(128).regex(/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/);
const approvalId = z.string().length(64).optional();
const pageSize = z.number().int().min(1).max(100).optional();
const page = z.number().int().min(1).max(10000).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;

async function mcpRequired(tool: string, args: Record<string, unknown>) {
  const result = await upstream.callMcp(tool, args);
  if (result === undefined) throw new Error(`${tool} requires the official Docker Hub MCP server; configure DOCKER_HUB_MCP_ARGS_JSON`);
  return result;
}

server.tool('dockerhub.search', 'Search Docker Hub content using the official Docker Hub MCP server.', {
  query: z.string().min(1).max(500)
}, async a => out(await mcpRequired('search', { query: a.query })));

server.tool('dockerhub.namespace.list', 'List namespaces accessible to the connected Docker Hub identity.', {}, async () => {
  return out(await mcpRequired('get-namespaces', {}));
});

server.tool('dockerhub.repository.list', 'List repositories in an allowed namespace. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, page, pageSize
}, async a => {
  assertTargetAllowed(config, a.namespace);
  const mcp = await upstream.callMcp('list-repositories-by-namespace', { namespace: a.namespace, page: a.page, page_size: a.pageSize });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories`, { page: a.page, page_size: a.pageSize }, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.repository.get', 'Get repository metadata. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('get-repository-info', { namespace: a.namespace, repository: a.repository });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}`, undefined, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.repository.create', 'Create a Docker Hub repository. WRITE; explicit approval required.', {
  namespace, repository, description: z.string().max(100).optional(), private: z.boolean().default(true), approvalId
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  assertApproval('dockerhub.repository.create', a.approvalId, config.approvalSecret);
  const args = { namespace: a.namespace, repository: a.repository, description: a.description, private: a.private };
  const mcp = await upstream.callMcp('create-repository', args);
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.post(`/namespaces/${enc(a.namespace)}/repositories`, { name: a.repository, description: a.description, is_private: a.private }, true));
});

server.tool('dockerhub.repository.update', 'Update repository description or visibility. WRITE; explicit approval required.', {
  namespace, repository, description: z.string().max(100).optional(), fullDescription: z.string().max(100000).optional(), private: z.boolean().optional(), approvalId
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  assertApproval('dockerhub.repository.update', a.approvalId, config.approvalSecret);
  if (a.description === undefined && a.fullDescription === undefined && a.private === undefined) throw new Error('At least one update field is required');
  const args = { namespace: a.namespace, repository: a.repository, description: a.description, full_description: a.fullDescription, private: a.private };
  const mcp = await upstream.callMcp('update-repository-info', args);
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.patch(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}`, {
    ...(a.description === undefined ? {} : { description: a.description }),
    ...(a.fullDescription === undefined ? {} : { full_description: a.fullDescription }),
    ...(a.private === undefined ? {} : { is_private: a.private })
  }, true));
});

server.tool('dockerhub.tag.list', 'List repository tags. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository, page, pageSize, ordering: z.enum(['last_updated', '-last_updated', 'name', '-name']).optional()
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('list-repository-tags', { namespace: a.namespace, repository: a.repository, page: a.page, page_size: a.pageSize });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}/tags`, { page: a.page, page_size: a.pageSize, ordering: a.ordering }, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.tag.get', 'Get one repository tag. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository, tag
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('read-repository-tag', { namespace: a.namespace, repository: a.repository, tag: a.tag });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}/tags/${enc(a.tag)}`, undefined, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.dockerfile.get', 'Get the Dockerfile associated with a Docker Hub repository through the official MCP server.', {
  namespace, repository
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  return out(await mcpRequired('get-repository-dockerfile', { namespace: a.namespace, repository: a.repository }));
});

server.tool('dockerhub.dockerfile.set', 'Set repository Dockerfile content through the official MCP server. WRITE; explicit approval required.', {
  namespace, repository, dockerfile: z.string().min(1).max(250000), approvalId
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  assertApproval('dockerhub.dockerfile.set', a.approvalId, config.approvalSecret);
  return out(await mcpRequired('set-repository-dockerfile', { namespace: a.namespace, repository: a.repository, dockerfile: a.dockerfile }));
});

const shutdown = () => { void upstream.close().finally(() => server.close()).then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
