import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { NewRelicClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new NewRelicClient(config);
const server = new McpServer({ name: 'new-relic-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const AccountId = z.number().int().positive();
const Guid = z.string().min(1).max(256).regex(/^[A-Za-z0-9=_:-]+$/);
const PolicyId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const gqlString = (v: string) => JSON.stringify(v);

server.tool('newrelic.account.list', 'List New Relic accounts accessible to the configured user key. READ.', {}, async () =>
  json(await client.query(`query { actor { accounts { id name } } }`)));

server.tool('newrelic.entity.search', 'Search New Relic entities with the official entity-search query grammar. READ.', {
  query: z.string().min(1).max(2000),
  cursor: z.string().min(1).max(2000).optional()
}, async ({ query, cursor }) => {
  const resultsArgs = cursor ? `(cursor: ${gqlString(cursor)})` : '';
  return json(await client.query(`query { actor { entitySearch(query: ${gqlString(query)}) { count query results${resultsArgs} { nextCursor entities { guid name entityType domain type reporting accountId tags { key values } } } } } }`));
});

server.tool('newrelic.entity.get', 'Fetch one entity by GUID. READ.', { guid: Guid }, async ({ guid }) =>
  json(await client.query(`query { actor { entity(guid: ${gqlString(guid)}) { guid name entityType domain type reporting accountId tags { key values } } } }`)));

server.tool('newrelic.entity.related.list', 'List one-hop relationships for an entity. READ.', { guid: Guid }, async ({ guid }) =>
  json(await client.query(`query { actor { entity(guid: ${gqlString(guid)}) { guid name relatedEntities { results { source { entity { guid name } } target { entity { guid name } } type } } } } }`)));

server.tool('newrelic.entity.tag.search', 'Search entities by an exact tag key/value pair. READ.', {
  tag_key: z.string().min(1).max(200).regex(/^[A-Za-z0-9_.-]+$/),
  tag_value: z.string().min(1).max(500),
  cursor: z.string().min(1).max(2000).optional()
}, async ({ tag_key, tag_value, cursor }) => {
  const search = `tags.${tag_key} = ${gqlString(tag_value)}`;
  const resultsArgs = cursor ? `(cursor: ${gqlString(cursor)})` : '';
  return json(await client.query(`query { actor { entitySearch(query: ${gqlString(search)}) { count results${resultsArgs} { nextCursor entities { guid name entityType domain type reporting accountId } } } } }`));
});

server.tool('newrelic.entity.non_reporting.list', 'Find entities that stopped reporting after a supplied epoch-millisecond timestamp. READ.', {
  changed_after_ms: z.number().int().nonnegative()
}, async ({ changed_after_ms }) => {
  const search = `reporting is false and lastReportingChangeAt > ${changed_after_ms}`;
  return json(await client.query(`query { actor { entitySearch(query: ${gqlString(search)}) { count results { nextCursor entities { guid name entityType domain type reporting accountId } } } } }`));
});

server.tool('newrelic.nrql.query', 'Execute a read-only NRQL query against one New Relic account. READ.', {
  account_id: AccountId,
  nrql: z.string().min(1).max(10000),
  timeout_ms: z.number().int().min(1000).max(60000).optional()
}, async ({ account_id, nrql, timeout_ms }) => {
  const timeout = timeout_ms ? `, timeout: ${Math.ceil(timeout_ms / 1000)}` : '';
  return json(await client.query(`query { actor { account(id: ${account_id}) { nrql(query: ${gqlString(nrql)}${timeout}) { results metadata { facets } } } } }`));
});

server.tool('newrelic.alert.policy.list', 'List alert policies for an account, optionally filtered by partial name. READ.', {
  account_id: AccountId,
  name_like: z.string().min(1).max(500).optional(),
  cursor: z.string().min(1).max(2000).optional()
}, async ({ account_id, name_like, cursor }) => {
  const criteria = name_like ? `searchCriteria: { nameLike: ${gqlString(name_like)} }` : '';
  const cursorArg = cursor ? `${criteria ? ', ' : ''}cursor: ${gqlString(cursor)}` : '';
  const args = criteria || cursorArg ? `(${criteria}${cursorArg})` : '';
  return json(await client.query(`query { actor { account(id: ${account_id}) { alerts { policiesSearch${args} { nextCursor totalCount policies { id name incidentPreference } } } } } }`));
});

server.tool('newrelic.alert.policy.get', 'Get one alert policy by ID. READ.', { account_id: AccountId, policy_id: PolicyId }, async ({ account_id, policy_id }) =>
  json(await client.query(`query { actor { account(id: ${account_id}) { alerts { policy(id: ${gqlString(policy_id)}) { id name incidentPreference } } } } }`)));

const IncidentPreference = z.enum(['PER_POLICY','PER_CONDITION','PER_CONDITION_AND_TARGET']);
server.tool('newrelic.alert.policy.create', 'Create an alert policy. WRITE; explicit operator approval is required by default.', {
  account_id: AccountId,
  name: z.string().min(1).max(500),
  incident_preference: IncidentPreference
}, async ({ account_id, name, incident_preference }) => {
  assertWriteAllowed(config, 'newrelic.alert.policy.create');
  return json(await client.query(`mutation { alertsPolicyCreate(accountId: ${account_id}, policy: { name: ${gqlString(name)}, incidentPreference: ${incident_preference} }) { id name incidentPreference } }`, {}, true));
});

server.tool('newrelic.alert.policy.update', 'Update an alert policy name and/or incident preference. WRITE; explicit operator approval is required by default.', {
  account_id: AccountId,
  policy_id: PolicyId,
  name: z.string().min(1).max(500).optional(),
  incident_preference: IncidentPreference.optional()
}, async ({ account_id, policy_id, name, incident_preference }) => {
  if (!name && !incident_preference) throw new Error('VALIDATION_ERROR: provide name or incident_preference');
  assertWriteAllowed(config, 'newrelic.alert.policy.update');
  const fields = [name ? `name: ${gqlString(name)}` : '', incident_preference ? `incidentPreference: ${incident_preference}` : ''].filter(Boolean).join(', ');
  return json(await client.query(`mutation { alertsPolicyUpdate(accountId: ${account_id}, id: ${gqlString(policy_id)}, policy: { ${fields} }) { id name incidentPreference } }`, {}, true));
});

server.tool('newrelic.alert.policy.delete', 'Delete an alert policy. DESTRUCTIVE; disabled by default and requires explicit strong approval.', {
  account_id: AccountId,
  policy_id: PolicyId
}, async ({ account_id, policy_id }) => {
  assertWriteAllowed(config, 'newrelic.alert.policy.delete', true);
  return json(await client.query(`mutation { alertsPolicyDelete(accountId: ${account_id}, id: ${gqlString(policy_id)}) { id } }`, {}, true));
});

await server.connect(new StdioServerTransport());
