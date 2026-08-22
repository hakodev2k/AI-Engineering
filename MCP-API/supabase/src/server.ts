import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SupabaseClient } from './client.js';
import { assertActionAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new SupabaseClient(config);
const server = new McpServer({ name: 'supabase-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Slug = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const Ref = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/);
const BranchName = z.string().min(1).max(100).regex(/^[A-Za-z0-9._/-]+$/);
const BranchIdOrRef = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);

server.tool('supabase.organization.list', 'List organizations visible to the configured Supabase identity. READ; organizations:read.', {},
  async () => json(await client.request('/v1/organizations')));

server.tool('supabase.organization.get', 'Get one organization. READ; organizations:read.', { slug: Slug },
  async ({ slug }) => json(await client.request(`/v1/organizations/${encodeURIComponent(slug)}`)));

server.tool('supabase.organization.member.list', 'List members of an organization. READ; organizations:read.', { slug: Slug },
  async ({ slug }) => json(await client.request(`/v1/organizations/${encodeURIComponent(slug)}/members`)));

server.tool('supabase.project.list', 'List all projects visible to the configured identity. READ; projects:read.', {},
  async () => json(await client.request('/v1/projects')));

server.tool('supabase.organization.project.list', 'List projects in an organization with bounded pagination. READ; projects:read.', {
  slug: Slug,
  offset: z.number().int().min(0).max(100000).default(0),
  limit: z.number().int().min(1).max(100).default(50),
  search: z.string().max(200).optional(),
  statuses: z.string().max(200).optional()
}, async ({ slug, ...query }) => json(await client.request(`/v1/organizations/${encodeURIComponent(slug)}/projects`, { query }))));

server.tool('supabase.function.list', 'List Edge Functions in a project. READ; edge_functions:read.', { ref: Ref },
  async ({ ref }) => json(await client.request(`/v1/projects/${encodeURIComponent(ref)}/functions`)));

server.tool('supabase.branch.list', 'List database branches for a project. READ; environment:read.', { ref: Ref },
  async ({ ref }) => json(await client.request(`/v1/projects/${encodeURIComponent(ref)}/branches`)));

server.tool('supabase.branch.get', 'Get a database branch by name. READ; environment:read.', { ref: Ref, name: BranchName },
  async ({ ref, name }) => json(await client.request(`/v1/projects/${encodeURIComponent(ref)}/branches/${encodeURIComponent(name)}`)));

server.tool('supabase.branch.create', 'Create a database branch. WRITE; environment:write; explicit operator approval required by default.', {
  ref: Ref,
  branch_name: BranchName,
  git_branch: BranchName.optional(),
  persistent: z.boolean().optional(),
  with_data: z.boolean().optional()
}, async ({ ref, ...body }) => {
  assertActionAllowed(config, 'supabase.branch.create');
  return json(await client.request(`/v1/projects/${encodeURIComponent(ref)}/branches`, { method: 'POST', body }));
});

server.tool('supabase.branch.merge', 'Merge a database branch. HIGH_RISK; environment:write; explicit operator approval required.', {
  branch_id_or_ref: BranchIdOrRef,
  migration_version: z.string().min(1).max(200).optional()
}, async ({ branch_id_or_ref, ...body }) => {
  assertActionAllowed(config, 'supabase.branch.merge');
  return json(await client.request(`/v1/branches/${encodeURIComponent(branch_id_or_ref)}/merge`, { method: 'POST', body }));
});

server.tool('supabase.branch.delete', 'Delete or schedule deletion of a database branch. DESTRUCTIVE; disabled by default and requires explicit strong approval.', {
  branch_id_or_ref: BranchIdOrRef,
  force: z.boolean().default(false)
}, async ({ branch_id_or_ref, force }) => {
  assertActionAllowed(config, 'supabase.branch.delete', true);
  return json(await client.request(`/v1/branches/${encodeURIComponent(branch_id_or_ref)}`, { method: 'DELETE', query: { force } }));
});

server.tool('supabase.log.query', 'Query unified project logs for a bounded window. READ; analytics:read. SQL is restricted to a single SELECT/WITH statement.', {
  ref: Ref,
  sql: z.string().min(1).max(5000),
  iso_timestamp_start: z.string().datetime().optional(),
  iso_timestamp_end: z.string().datetime().optional()
}, async ({ ref, sql, iso_timestamp_start, iso_timestamp_end }) => {
  const normalized = sql.trim();
  if (!/^(select|with)\b/i.test(normalized) || normalized.includes(';')) {
    throw new Error('VALIDATION_ERROR: log SQL must be one SELECT/WITH statement without semicolons');
  }
  if ((iso_timestamp_start && !iso_timestamp_end) || (!iso_timestamp_start && iso_timestamp_end)) {
    throw new Error('VALIDATION_ERROR: provide both iso_timestamp_start and iso_timestamp_end or neither');
  }
  if (iso_timestamp_start && iso_timestamp_end) {
    const start = Date.parse(iso_timestamp_start);
    const end = Date.parse(iso_timestamp_end);
    if (end <= start) throw new Error('VALIDATION_ERROR: end must be after start');
    if (end - start > 24 * 60 * 60 * 1000) throw new Error('VALIDATION_ERROR: log query window cannot exceed 24 hours');
  }
  return json(await client.request(`/v1/projects/${encodeURIComponent(ref)}/analytics/endpoints/logs`, {
    query: { sql: normalized, iso_timestamp_start, iso_timestamp_end }
  }));
});

await server.connect(new StdioServerTransport());
