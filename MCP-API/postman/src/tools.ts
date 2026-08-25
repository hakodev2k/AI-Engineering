import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from './config.js';
import { assertAllowed } from './policy.js';
import { PostmanRestClient } from './rest.js';
import { PostmanMcpClient } from './upstream.js';

const id = z.string().min(1).max(300);
const approval = z.string().regex(/^[a-f0-9]{64}$/).optional();
const workspaceBody = z.object({ name: z.string().min(1).max(120), type: z.enum(['personal', 'team', 'private', 'public', 'partner']).optional(), description: z.string().max(5000).optional() }).strict();
const collectionBody = z.record(z.unknown()).refine(v => typeof v.info === 'object' && v.info !== null, 'collection.info is required');
const environmentBody = z.object({ name: z.string().min(1).max(255), values: z.array(z.object({ key: z.string().min(1), value: z.union([z.string(), z.number(), z.boolean()]), enabled: z.boolean().optional(), type: z.enum(['default', 'secret']).optional() }).strict()).default([]) }).strict();

function output(transport: string, data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ transport, untrustedProviderData: true, data }) }] };
}

export function registerTools(server: McpServer, config: Config, rest: PostmanRestClient, mcp: PostmanMcpClient): void {
  server.registerTool('postman.workspace.list', { description: 'List Postman workspaces. READ. Uses official Postman MCP with REST fallback.', inputSchema: z.object({}).strict() }, async () => {
    try { return output('official-mcp', await mcp.call('getWorkspaces')); }
    catch { return output('rest-fallback', await rest.listWorkspaces()); }
  });

  server.registerTool('postman.workspace.get', { description: 'Get one Postman workspace by ID. READ.', inputSchema: z.object({ workspaceId: id }).strict() }, async ({ workspaceId }) => {
    try { return output('official-mcp', await mcp.call('getWorkspace', { workspaceId })); }
    catch { return output('rest-fallback', await rest.getWorkspace(workspaceId)); }
  });

  server.registerTool('postman.workspace.create', { description: 'Create a Postman workspace. WRITE; approval is configurable.', inputSchema: z.object({ workspace: workspaceBody, approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.workspace.create', args as Record<string, unknown>);
    return output('rest', await rest.createWorkspace(args.workspace));
  });

  server.registerTool('postman.workspace.update', { description: 'Replace mutable metadata for a workspace. WRITE; approval is configurable.', inputSchema: z.object({ workspaceId: id, workspace: workspaceBody, approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.workspace.update', args as Record<string, unknown>);
    return output('rest', await rest.updateWorkspace(args.workspaceId, args.workspace));
  });

  server.registerTool('postman.collection.list', { description: 'List Postman collections, optionally scoped to a workspace. READ.', inputSchema: z.object({ workspaceId: id.optional() }).strict() }, async ({ workspaceId }) => {
    try { return output('official-mcp', await mcp.call('getCollections', workspaceId ? { workspace: workspaceId } : {})); }
    catch { return output('rest-fallback', await rest.listCollections(workspaceId)); }
  });

  server.registerTool('postman.collection.get', { description: 'Get a Postman collection by UID. READ.', inputSchema: z.object({ collectionId: id }).strict() }, async ({ collectionId }) => {
    try { return output('official-mcp', await mcp.call('getCollection', { collectionId })); }
    catch { return output('rest-fallback', await rest.getCollection(collectionId)); }
  });

  server.registerTool('postman.collection.create', { description: 'Create a Postman collection. WRITE; approval is configurable.', inputSchema: z.object({ collection: collectionBody, workspaceId: id.optional(), approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.collection.create', args as Record<string, unknown>);
    return output('rest', await rest.createCollection(args.collection, args.workspaceId));
  });

  server.registerTool('postman.collection.replace', { description: 'Replace a Postman collection by UID. WRITE; approval is configurable.', inputSchema: z.object({ collectionId: id, collection: collectionBody, approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.collection.replace', args as Record<string, unknown>);
    return output('rest', await rest.replaceCollection(args.collectionId, args.collection));
  });

  server.registerTool('postman.environment.list', { description: 'List Postman environments, optionally scoped to a workspace. READ.', inputSchema: z.object({ workspaceId: id.optional() }).strict() }, async ({ workspaceId }) => {
    try { return output('official-mcp', await mcp.call('getEnvironments', workspaceId ? { workspace: workspaceId } : {})); }
    catch { return output('rest-fallback', await rest.listEnvironments(workspaceId)); }
  });

  server.registerTool('postman.environment.get', { description: 'Get a Postman environment by UID. READ.', inputSchema: z.object({ environmentId: id }).strict() }, async ({ environmentId }) => {
    try { return output('official-mcp', await mcp.call('getEnvironment', { environmentId })); }
    catch { return output('rest-fallback', await rest.getEnvironment(environmentId)); }
  });

  server.registerTool('postman.environment.create', { description: 'Create a Postman environment. WRITE; approval is configurable.', inputSchema: z.object({ environment: environmentBody, workspaceId: id.optional(), approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.environment.create', args as Record<string, unknown>);
    return output('rest', await rest.createEnvironment(args.environment, args.workspaceId));
  });

  server.registerTool('postman.environment.replace', { description: 'Replace a Postman environment by UID. WRITE; approval is configurable.', inputSchema: z.object({ environmentId: id, environment: environmentBody, approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.environment.replace', args as Record<string, unknown>);
    return output('rest', await rest.replaceEnvironment(args.environmentId, args.environment));
  });

  server.registerTool('postman.spec.list', { description: 'List API specifications visible to the authenticated user. READ; official MCP only.', inputSchema: z.object({ workspaceId: id.optional() }).strict() }, async ({ workspaceId }) => {
    return output('official-mcp', await mcp.call('getAllSpecs', workspaceId ? { workspaceId } : {}));
  });

  server.registerTool('postman.spec.get', { description: 'Get API specification metadata by ID. READ; official MCP only.', inputSchema: z.object({ specId: id }).strict() }, async ({ specId }) => {
    return output('official-mcp', await mcp.call('getSpec', { specId }));
  });

  server.registerTool('postman.collection.run', { description: 'Run a Postman collection through the official MCP server. HIGH_RISK because requests may call external systems; explicit approval always required.', inputSchema: z.object({ collectionId: id, environmentId: id.optional(), iterationCount: z.number().int().min(1).max(100).default(1), approvalToken: approval }).strict() }, async (args) => {
    assertAllowed(config, 'postman.collection.run', args as Record<string, unknown>);
    const upstreamArgs: Record<string, unknown> = { collectionId: args.collectionId, iterationCount: args.iterationCount };
    if (args.environmentId) upstreamArgs.environmentId = args.environmentId;
    return output('official-mcp', await mcp.call('runCollection', upstreamArgs));
  });
}
