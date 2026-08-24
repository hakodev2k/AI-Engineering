import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertOrgAllowed, assertWorkspaceAllowed, loadConfig } from './config.js';
import { assertPermission } from './policy.js';
import { HybridUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new HybridUpstream(config);
const server = new McpServer({ name: 'terraform-cloud-mcp-connector', version: '1.0.0' });
const id = z.string().min(1).max(200);
const org = z.string().min(1).max(200);
const workspace = z.string().min(1).max(200);
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;

server.tool('terraform_cloud.organization.list', 'List HCP Terraform organizations visible to the configured token. READ.', {}, async () =>
  out(await upstream.preferred('list_terraform_orgs', {}, () => upstream.request('GET', '/organizations'))));

server.tool('terraform_cloud.project.list', 'List projects in an organization. READ.', { organization: org }, async a => {
  assertOrgAllowed(config, a.organization);
  return out(await upstream.preferred('list_terraform_projects', { organization_name: a.organization }, () => upstream.request('GET', `/organizations/${enc(a.organization)}/projects`)));
});

server.tool('terraform_cloud.workspace.list', 'List/search workspaces in an organization. READ.', {
  organization: org, search: z.string().max(300).optional(), pageNumber: z.number().int().min(1).max(10000).optional(), pageSize: z.number().int().min(1).max(100).optional()
}, async a => {
  assertOrgAllowed(config, a.organization);
  return out(await upstream.preferred('list_workspaces', { organization_name: a.organization, search: a.search }, () => upstream.request('GET', `/organizations/${enc(a.organization)}/workspaces`, undefined, { 'search[name]': a.search, 'page[number]': a.pageNumber, 'page[size]': a.pageSize })));
});

server.tool('terraform_cloud.workspace.get', 'Get workspace details. READ.', { workspaceId: id }, async a => {
  assertWorkspaceAllowed(config, a.workspaceId);
  return out(await upstream.preferred('get_workspace_details', { workspace_id: a.workspaceId }, () => upstream.request('GET', `/workspaces/${enc(a.workspaceId)}`)));
});

server.tool('terraform_cloud.run.list', 'List runs for a workspace. READ. The provider applies a lower rate limit to this endpoint.', {
  workspaceId: id, pageNumber: z.number().int().min(1).max(10000).optional(), pageSize: z.number().int().min(1).max(100).optional()
}, async a => {
  assertWorkspaceAllowed(config, a.workspaceId);
  return out(await upstream.preferred('list_runs', { workspace_id: a.workspaceId }, () => upstream.request('GET', `/workspaces/${enc(a.workspaceId)}/runs`, undefined, { 'page[number]': a.pageNumber, 'page[size]': a.pageSize })));
});

server.tool('terraform_cloud.run.get', 'Get detailed run information. READ.', { runId: id }, async a =>
  out(await upstream.preferred('get_run_details', { run_id: a.runId }, () => upstream.request('GET', `/runs/${enc(a.runId)}`))));

server.tool('terraform_cloud.variable.list', 'List variables in a workspace. READ. Sensitive variable values remain redacted by HCP Terraform.', { workspaceId: id }, async a => {
  assertWorkspaceAllowed(config, a.workspaceId);
  return out(await upstream.preferred('list_workspace_variables', { workspace_id: a.workspaceId }, () => upstream.request('GET', `/workspaces/${enc(a.workspaceId)}/vars`)));
});

server.tool('terraform_cloud.workspace.create', 'Create a workspace. WRITE and requires explicit approval.', {
  organization: org, name: workspace, projectId: id.optional(), terraformVersion: z.string().max(64).optional(), autoApply: z.boolean().optional(), approvalId
}, async a => {
  assertOrgAllowed(config, a.organization);
  assertPermission(config, 'terraform_cloud.workspace.create', 'WRITE', a.approvalId);
  const data = { type: 'workspaces', attributes: { name: a.name, 'terraform-version': a.terraformVersion, 'auto-apply': a.autoApply }, ...(a.projectId ? { relationships: { project: { data: { type: 'projects', id: a.projectId } } } } : {}) };
  return out(await upstream.preferred('create_workspace', { organization_name: a.organization, workspace_name: a.name, project_id: a.projectId, terraform_version: a.terraformVersion, auto_apply: a.autoApply }, () => upstream.request('POST', `/organizations/${enc(a.organization)}/workspaces`, { data })));
});

server.tool('terraform_cloud.run.create_plan', 'Create a speculative plan-only run. WRITE and requires explicit approval; never auto-applies.', {
  workspaceId: id, message: z.string().max(500).optional(), approvalId
}, async a => {
  assertWorkspaceAllowed(config, a.workspaceId);
  assertPermission(config, 'terraform_cloud.run.create_plan', 'WRITE', a.approvalId);
  const data = { type: 'runs', attributes: { message: a.message, 'plan-only': true }, relationships: { workspace: { data: { type: 'workspaces', id: a.workspaceId } } } };
  return out(await upstream.preferred('create_run', { workspace_id: a.workspaceId, run_type: 'plan_only', message: a.message }, () => upstream.request('POST', '/runs', { data })));
});

server.tool('terraform_cloud.run.apply', 'Apply an existing run. HIGH_RISK and requires write + destructive enablement plus explicit approval.', {
  runId: id, comment: z.string().max(500).optional(), approvalId
}, async a => {
  assertPermission(config, 'terraform_cloud.run.apply', 'HIGH_RISK', a.approvalId);
  return out(await upstream.preferred('action_run', { run_id: a.runId, action: 'apply', comment: a.comment }, () => upstream.request('POST', `/runs/${enc(a.runId)}/actions/apply`, { comment: a.comment })));
});

server.tool('terraform_cloud.run.cancel', 'Cancel a running run. HIGH_RISK and requires explicit approval.', {
  runId: id, comment: z.string().max(500).optional(), approvalId
}, async a => {
  assertPermission(config, 'terraform_cloud.run.cancel', 'HIGH_RISK', a.approvalId);
  return out(await upstream.preferred('action_run', { run_id: a.runId, action: 'cancel', comment: a.comment }, () => upstream.request('POST', `/runs/${enc(a.runId)}/actions/cancel`, { comment: a.comment })));
});

server.tool('terraform_cloud.workspace.safe_delete', 'Safely delete a workspace only when HCP Terraform confirms no managed resources. DESTRUCTIVE and requires explicit approval.', {
  organization: org, name: workspace, approvalId
}, async a => {
  assertOrgAllowed(config, a.organization); assertWorkspaceAllowed(config, a.name);
  assertPermission(config, 'terraform_cloud.workspace.safe_delete', 'DESTRUCTIVE', a.approvalId);
  return out(await upstream.preferred('delete_workspace_safely', { organization_name: a.organization, workspace_name: a.name }, () => upstream.request('POST', `/organizations/${enc(a.organization)}/workspaces/${enc(a.name)}/actions/safe-delete`)));
});

const shutdown = async () => { await upstream.close(); await server.close(); process.exit(0); };
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
await server.connect(new StdioServerTransport());
