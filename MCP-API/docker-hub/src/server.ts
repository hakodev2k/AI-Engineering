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

server.tool('dockerhub.search', 'Search Docker Hub using the official Docker Hub MCP Search V4 tool.', {
  query: z.string().min(1).max(500),
  architectures: z.string().max(200).optional(),
  operatingSystems: z.string().max(200).optional(),
  size: z.number().int().min(1).max(100).optional()
}, async a => out(await mcpRequired('search', {
  query: a.query,
  architectures: a.architectures,
  operating_systems: a.operatingSystems,
  size: a.size
})));

server.tool('dockerhub.namespace.list', 'List namespaces accessible to the connected Docker Hub identity.', {
  page: z.string().regex(/^\d+$/).optional(), pageSize: z.string().regex(/^\d+$/).optional()
}, async a => out(await mcpRequired('get_namespaces', { page: a.page, page_size: a.pageSize })));

server.tool('dockerhub.repository.list', 'List repositories in an allowed namespace. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, page, pageSize, name: z.string().max(255).optional(), ordering: z.string().max(100).optional()
}, async a => {
  assertTargetAllowed(config, a.namespace);
  const mcp = await upstream.callMcp('list_repositories_by_namespace', { namespace: a.namespace, page: a.page, page_size: a.pageSize, name: a.name, ordering: a.ordering });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories`, { page: a.page, page_size: a.pageSize, name: a.name, ordering: a.ordering }, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.repository.get', 'Get repository metadata. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('get_repository_info', { namespace: a.namespace, repository: a.repository });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}`, undefined, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.repository.check', 'Check whether a repository exists using the official Docker Hub MCP server.', {
  namespace, repository
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  return out(await mcpRequired('check_repository', { namespace: a.namespace, repository: a.repository }));
});

server.tool('dockerhub.repository.create', 'Create a Docker Hub repository. WRITE; explicit approval required.', {
  namespace, repository, description: z.string().max(100).optional(), private: z.boolean().default(true), approvalId
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  assertApproval('dockerhub.repository.create', a.approvalId, config.approvalSecret);
  const body = { name: a.repository, description: a.description, is_private: a.private };
  const mcp = await upstream.callMcp('create_repository', { namespace: a.namespace, body });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.post(`/namespaces/${enc(a.namespace)}/repositories`, body, true));
});

server.tool('dockerhub.repository.update', 'Update repository description or visibility. WRITE; explicit approval required.', {
  namespace, repository, description: z.string().max(100).optional(), fullDescription: z.string().max(100000).optional(), private: z.boolean().optional(), approvalId
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  assertApproval('dockerhub.repository.update', a.approvalId, config.approvalSecret);
  if (a.description === undefined && a.fullDescription === undefined && a.private === undefined) throw new Error('At least one update field is required');
  const body = {
    ...(a.description === undefined ? {} : { description: a.description }),
    ...(a.fullDescription === undefined ? {} : { full_description: a.fullDescription }),
    ...(a.private === undefined ? {} : { is_private: a.private })
  };
  const mcp = await upstream.callMcp('update_repository_info', { namespace: a.namespace, repository: a.repository, body });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.patch(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}`, body, true));
});

server.tool('dockerhub.tag.list', 'List repository tags. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository, page, pageSize, architecture: z.string().max(100).optional(), os: z.string().max(100).optional()
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('list_repository_tags', { namespace: a.namespace, repository: a.repository, page: a.page, page_size: a.pageSize, architecture: a.architecture, os: a.os });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}/tags`, { page: a.page, page_size: a.pageSize, architecture: a.architecture, os: a.os }, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.tag.get', 'Get one repository tag. Official MCP is preferred; Docker Hub API v2 is the fallback.', {
  namespace, repository, tag
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  const mcp = await upstream.callMcp('read_repository_tag', { namespace: a.namespace, repository: a.repository, tag: a.tag });
  if (mcp !== undefined) return out(mcp);
  return out(await upstream.rest.get(`/namespaces/${enc(a.namespace)}/repositories/${enc(a.repository)}/tags/${enc(a.tag)}`, undefined, Boolean(config.username && config.pat)));
});

server.tool('dockerhub.tag.check', 'Check whether a specific repository tag exists using the official Docker Hub MCP server.', {
  namespace, repository, tag
}, async a => {
  assertTargetAllowed(config, a.namespace, a.repository);
  return out(await mcpRequired('check_repository_tag', { namespace: a.namespace, repository: a.repository, tag: a.tag }));
});

server.tool('dockerhub.hardened_image.list', 'Query mirrored Docker Hardened Images using the official Docker Hub MCP server.', {
  namespace: namespace.optional()
}, async a => {
  if (a.namespace) assertTargetAllowed(config, a.namespace);
  return out(await mcpRequired('docker_hardened_images', { namespace: a.namespace }));
});

const shutdown = () => { void upstream.close().finally(() => server.close()).then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
