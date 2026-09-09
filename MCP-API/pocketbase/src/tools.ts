import { z } from 'zod';
import type { PocketBaseClient } from './client.js';
import type { Risk } from './policy.js';

export type ToolDef = {
  description: string;
  risk: Risk;
  schema: z.ZodObject<any>;
  run: (input: any) => Promise<unknown>;
};

const collection = z.string().min(1).max(255).regex(/^[A-Za-z0-9_.-]+$/);
const id = z.string().min(1).max(255).regex(/^[A-Za-z0-9_-]+$/);
const page = z.number().int().min(1).max(100000).default(1);
const perPage = z.number().int().min(1).max(100).default(30);
const filter = z.string().max(2000).optional();
const sort = z.string().max(500).optional();
const fields = z.string().max(1000).optional();
const approved = z.boolean().optional();
const recordData = z.record(z.string().min(1).max(255), z.unknown()).superRefine((value, ctx) => {
  for (const key of Object.keys(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unsafe key: ${key}` });
  }
  const bytes = Buffer.byteLength(JSON.stringify(value));
  if (bytes > 262144) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Record payload exceeds 256 KiB connector limit' });
});
const backupKey = z.string().min(5).max(255).regex(/^[A-Za-z0-9_-]+\.zip$/);

export function buildTools(client: PocketBaseClient): Map<string, ToolDef> {
  const tools = new Map<string, ToolDef>();
  const add = (name: string, def: ToolDef) => tools.set(name, def);

  add('pocketbase.health.check', { description: 'Check PocketBase server health.', risk: 'READ', schema: z.object({}).strict(), run: () => client.request('GET', '/api/health', { auth: false }) });
  add('pocketbase.collection.list', { description: 'List collection schemas. PocketBase restricts this to superusers.', risk: 'READ', schema: z.object({ page, perPage, filter, sort, fields }).strict(), run: a => client.request('GET', '/api/collections', { query: a }) });
  add('pocketbase.collection.get', { description: 'Get one collection schema by name or ID. Superuser only.', risk: 'READ', schema: z.object({ collection, fields }).strict(), run: a => client.request('GET', `/api/collections/${encodeURIComponent(a.collection)}`, { query: { fields: a.fields } }) });
  add('pocketbase.record.list', { description: 'List records from one collection, subject to PocketBase ListRule and token permissions.', risk: 'READ', schema: z.object({ collection, page, perPage, filter, sort, fields, expand: z.string().max(1000).optional(), skipTotal: z.boolean().optional() }).strict(), run: a => client.request('GET', `/api/collections/${encodeURIComponent(a.collection)}/records`, { query: { page: a.page, perPage: a.perPage, filter: a.filter, sort: a.sort, fields: a.fields, expand: a.expand, skipTotal: a.skipTotal } }) });
  add('pocketbase.record.get', { description: 'Get a record by collection and ID, subject to PocketBase ViewRule.', risk: 'READ', schema: z.object({ collection, id, fields, expand: z.string().max(1000).optional() }).strict(), run: a => client.request('GET', `/api/collections/${encodeURIComponent(a.collection)}/records/${encodeURIComponent(a.id)}`, { query: { fields: a.fields, expand: a.expand } }) });
  add('pocketbase.record.create', { description: 'Create a record. Requires provider CreateRule permission and human approval by default.', risk: 'WRITE', schema: z.object({ collection, data: recordData, approved }).strict(), run: a => client.request('POST', `/api/collections/${encodeURIComponent(a.collection)}/records`, { body: a.data }) });
  add('pocketbase.record.update', { description: 'Update a record. Requires provider UpdateRule permission and human approval by default.', risk: 'WRITE', schema: z.object({ collection, id, data: recordData, approved }).strict(), run: a => client.request('PATCH', `/api/collections/${encodeURIComponent(a.collection)}/records/${encodeURIComponent(a.id)}`, { body: a.data }) });
  add('pocketbase.record.delete', { description: 'Delete a record. Destructive and disabled by default.', risk: 'DESTRUCTIVE', schema: z.object({ collection, id, approved }).strict(), run: a => client.request('DELETE', `/api/collections/${encodeURIComponent(a.collection)}/records/${encodeURIComponent(a.id)}`) });
  add('pocketbase.log.list', { description: 'List PocketBase API logs. Superuser only.', risk: 'READ', schema: z.object({ page, perPage, filter, sort, fields }).strict(), run: a => client.request('GET', '/api/logs', { query: a }) });
  add('pocketbase.log.get', { description: 'Get one PocketBase API log. Superuser only.', risk: 'READ', schema: z.object({ id, fields }).strict(), run: a => client.request('GET', `/api/logs/${encodeURIComponent(a.id)}`, { query: { fields: a.fields } }) });
  add('pocketbase.log.stats', { description: 'Get hourly aggregated PocketBase log statistics. Superuser only.', risk: 'READ', schema: z.object({ filter, fields }).strict(), run: a => client.request('GET', '/api/logs/stats', { query: a }) });
  add('pocketbase.backup.list', { description: 'List available backups. Superuser only.', risk: 'READ', schema: z.object({ fields }).strict(), run: a => client.request('GET', '/api/backups', { query: a }) });
  add('pocketbase.backup.create', { description: 'Create a PocketBase data backup. High risk because it consumes storage and affects backup operations.', risk: 'HIGH_RISK', schema: z.object({ name: backupKey.optional(), approved }).strict(), run: a => client.request('POST', '/api/backups', { body: a.name ? { name: a.name } : {} }) });
  add('pocketbase.backup.delete', { description: 'Delete a backup permanently. Destructive and disabled by default.', risk: 'DESTRUCTIVE', schema: z.object({ key: backupKey, approved }).strict(), run: a => client.request('DELETE', `/api/backups/${encodeURIComponent(a.key)}`) });
  add('pocketbase.backup.restore', { description: 'Restore a backup and restart the PocketBase process. Destructive and disabled by default.', risk: 'DESTRUCTIVE', schema: z.object({ key: backupKey, approved, acknowledgement: z.literal('RESTORE_AND_RESTART') }).strict(), run: a => client.request('POST', `/api/backups/${encodeURIComponent(a.key)}/restore`) });

  return tools;
}
