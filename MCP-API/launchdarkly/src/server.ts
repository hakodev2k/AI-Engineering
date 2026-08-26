import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, type Config } from './config.js';
import { assertAllowed } from './policy.js';
import { LaunchDarklyRestClient } from './rest.js';
import { LaunchDarklyMcpClient } from './upstream-mcp.js';

const key = z.string().min(1).max(256).regex(/^[A-Za-z0-9._:-]+$/);
const limit = z.number().int().min(1).max(100).default(20);
const offset = z.number().int().min(0).default(0);
const approvalId = z.string().min(32).max(256).optional();
const jsonValue = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.any()), z.record(z.any())]);
const patchOp = z.object({
  op: z.enum(['add', 'remove', 'replace', 'test']),
  path: z.string().min(1).max(1024).regex(/^\//),
  value: jsonValue.optional()
}).strict();

function output(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ provider: 'launchdarkly', untrustedProviderData: true, data }) }] };
}

function mcpConfigured(config: Config): boolean {
  if (config.mcpMode === 'rest') return false;
  return config.mcpMode === 'hosted' ? Boolean(config.mcpAccessToken) : Boolean(config.accessToken);
}

export function createServer(config: Config = loadConfig(), rest = new LaunchDarklyRestClient(config), upstream = new LaunchDarklyMcpClient(config)) {
  const server = new McpServer({ name: 'launchdarkly-connector', version: '1.0.0' });

  async function flagRead(tool: string, request: Record<string, unknown>, fallback: () => Promise<unknown>) {
    if (mcpConfigured(config)) {
      try { return await upstream.call(tool, request, 'read'); } catch { return fallback(); }
    }
    return fallback();
  }

  async function flagWrite(tool: string, request: Record<string, unknown>, fallback: () => Promise<unknown>) {
    if (mcpConfigured(config)) return upstream.call(tool, request, 'write');
    return fallback();
  }

  server.tool('launchdarkly.project.list', 'List LaunchDarkly projects with bounded pagination.', { limit, offset, filter: z.string().max(512).optional() }, async ({ limit, offset, filter }) => output(await rest.listProjects(limit, offset, filter)));
  server.tool('launchdarkly.project.get', 'Get one LaunchDarkly project.', { projectKey: key }, async ({ projectKey }) => output(await rest.getProject(projectKey)));
  server.tool('launchdarkly.environment.list', 'List environments in a project.', { projectKey: key, limit, offset, filter: z.string().max(512).optional() }, async ({ projectKey, limit, offset, filter }) => output(await rest.listEnvironments(projectKey, limit, offset, filter)));

  server.tool('launchdarkly.flag.list', 'List feature flags. Uses the official LaunchDarkly MCP server when configured, otherwise REST.', { projectKey: key, limit, offset, environmentKey: key.optional(), filter: z.string().max(512).optional() }, async ({ projectKey, limit, offset, environmentKey, filter }) => {
    const request = { projectKey, limit, offset, env: environmentKey, filter };
    return output(await flagRead('list-feature-flags', request, () => rest.listFlags(projectKey, limit, offset, environmentKey, filter)));
  });

  server.tool('launchdarkly.flag.get', 'Get one feature flag.', { projectKey: key, flagKey: key, environmentKey: key.optional() }, async ({ projectKey, flagKey, environmentKey }) => {
    return output(await flagRead('get-feature-flag', { projectKey, featureFlagKey: flagKey, env: environmentKey }, () => rest.getFlag(projectKey, flagKey, environmentKey)));
  });

  server.tool('launchdarkly.flag.create', 'Create a feature flag. Requires human approval.', {
    projectKey: key, name: z.string().min(1).max(256), flagKey: key, description: z.string().max(2000).optional(), temporary: z.boolean().optional(), tags: z.array(z.string().min(1).max(64)).max(20).optional(), approvalId
  }, async ({ projectKey, name, flagKey, description, temporary, tags, approvalId }) => {
    assertAllowed('launchdarkly.flag.create', approvalId, config);
    const body = { name, key: flagKey, description, temporary, tags };
    return output(await flagWrite('create-feature-flag', { projectKey, FeatureFlagBody: body }, () => rest.createFlag(projectKey, body)));
  });

  server.tool('launchdarkly.flag.update', 'Apply a constrained JSON Patch to a feature flag. Requires explicit human approval because targeting or rollout behavior may change.', {
    projectKey: key, flagKey: key, patch: z.array(patchOp).min(1).max(50), comment: z.string().min(1).max(1000), dryRun: z.boolean().default(false), approvalId
  }, async ({ projectKey, flagKey, patch, comment, dryRun, approvalId }) => {
    assertAllowed('launchdarkly.flag.update', approvalId, config);
    const request = { projectKey, featureFlagKey: flagKey, dryRun, PatchWithComment: { patch, comment } };
    return output(await flagWrite('update-feature-flag', request, () => dryRun ? Promise.reject(new Error('REST fallback does not emulate dryRun; configure official MCP or omit dryRun')) : rest.updateFlag(projectKey, flagKey, patch)));
  });

  server.tool('launchdarkly.flag.delete', 'Delete a feature flag. Disabled by default and requires strong human approval.', { projectKey: key, flagKey: key, approvalId }, async ({ projectKey, flagKey, approvalId }) => {
    assertAllowed('launchdarkly.flag.delete', approvalId, config);
    return output(await flagWrite('delete-feature-flag', { projectKey, featureFlagKey: flagKey }, () => rest.deleteFlag(projectKey, flagKey)));
  });

  server.tool('launchdarkly.segment.list', 'List segments in an environment.', { projectKey: key, environmentKey: key, limit, offset }, async ({ projectKey, environmentKey, limit, offset }) => output(await rest.listSegments(projectKey, environmentKey, limit, offset)));
  server.tool('launchdarkly.segment.get', 'Get a segment.', { projectKey: key, environmentKey: key, segmentKey: key }, async ({ projectKey, environmentKey, segmentKey }) => output(await rest.getSegment(projectKey, environmentKey, segmentKey)));
  server.tool('launchdarkly.segment.create', 'Create a rule-based segment. Requires human approval.', {
    projectKey: key, environmentKey: key, segmentKey: key, name: z.string().min(1).max(256), description: z.string().max(2000).optional(), tags: z.array(z.string().min(1).max(64)).max(20).optional(), approvalId
  }, async ({ projectKey, environmentKey, segmentKey, name, description, tags, approvalId }) => {
    assertAllowed('launchdarkly.segment.create', approvalId, config);
    return output(await rest.createSegment(projectKey, environmentKey, { key: segmentKey, name, description, tags }));
  });
  server.tool('launchdarkly.segment.update', 'Apply a constrained JSON Patch to a segment. Requires explicit human approval.', {
    projectKey: key, environmentKey: key, segmentKey: key, patch: z.array(patchOp).min(1).max(50), approvalId
  }, async ({ projectKey, environmentKey, segmentKey, patch, approvalId }) => {
    assertAllowed('launchdarkly.segment.update', approvalId, config);
    return output(await rest.updateSegment(projectKey, environmentKey, segmentKey, patch));
  });

  server.tool('launchdarkly.webhook.list', 'List LaunchDarkly webhooks.', {}, async () => output(await rest.listWebhooks()));
  server.tool('launchdarkly.webhook.create', 'Create a LaunchDarkly webhook subscription. Requires explicit approval because it sends data to an external endpoint.', {
    url: z.string().url().max(2048).refine(v => new URL(v).protocol === 'https:', 'Webhook URL must use HTTPS'), on: z.boolean().default(true), statements: z.array(z.record(z.any())).max(20).optional(), name: z.string().max(256).optional(), approvalId
  }, async ({ url, on, statements, name, approvalId }) => {
    assertAllowed('launchdarkly.webhook.create', approvalId, config);
    return output(await rest.createWebhook({ url, on, statements, name }));
  });
  server.tool('launchdarkly.webhook.delete', 'Delete a webhook. Disabled by default and requires strong approval.', { webhookId: key, approvalId }, async ({ webhookId, approvalId }) => {
    assertAllowed('launchdarkly.webhook.delete', approvalId, config);
    return output(await rest.deleteWebhook(webhookId));
  });

  return server;
}

export async function main() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
