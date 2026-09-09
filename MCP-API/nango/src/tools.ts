import { z } from 'zod';
import type { Risk } from './policy.js';
import type { NangoManagementClient } from './upstream.js';

export type ToolDef = {
  name: string;
  purpose: string;
  risk: Risk;
  requiredScope: string;
  upstream: string;
  schema: z.ZodTypeAny;
  map: (input: any) => Record<string, unknown>;
};

const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/);
const tags = z.record(z.string().min(1).max(100), z.string().max(500)).refine((v) => Object.keys(v).length <= 20, 'At most 20 tags');
const approved = z.boolean().optional();

export const toolDefs: ToolDef[] = [
  {
    name: 'nango.integration.list', purpose: 'List integrations configured in the current Nango environment.', risk: 'READ',
    requiredScope: 'environment:integrations:list', upstream: 'integrations_list',
    schema: z.object({}).strict(), map: () => ({})
  },
  {
    name: 'nango.integration.get', purpose: 'Read one configured integration by integration ID.', risk: 'READ',
    requiredScope: 'environment:integrations:read', upstream: 'integrations_get',
    schema: z.object({ integration_id: id }).strict(), map: (a) => ({ integration_id: a.integration_id })
  },
  {
    name: 'nango.connection.list', purpose: 'List connection metadata without requesting provider credentials.', risk: 'READ',
    requiredScope: 'environment:connections:list', upstream: 'connections_list',
    schema: z.object({ integration_id: id.optional(), connection_id: id.optional(), tags: tags.optional() }).strict(),
    map: (a) => ({ integration_id: a.integration_id, connection_id: a.connection_id, tags: a.tags })
  },
  {
    name: 'nango.connect_session.create', purpose: 'Create a short-lived Connect session link for an end user to authorize selected integrations.', risk: 'WRITE',
    requiredScope: 'environment:connect_sessions:write', upstream: 'connect_session_create',
    schema: z.object({ allowed_integrations: z.array(id).min(1).max(20), tags: tags.optional(), approved }).strict(),
    map: (a) => ({ allowed_integrations: a.allowed_integrations, tags: a.tags || {} })
  },
  {
    name: 'nango.function.list', purpose: 'List deployed or configured Nango functions.', risk: 'READ',
    requiredScope: 'environment:functions:list', upstream: 'functions_list',
    schema: z.object({}).strict(), map: () => ({})
  },
  {
    name: 'nango.log.operation.list', purpose: 'List Nango operation logs for diagnostics.', risk: 'READ',
    requiredScope: 'environment:logs:read', upstream: 'logs_list_operations',
    schema: z.object({ limit: z.number().int().min(1).max(100).optional() }).strict(), map: (a) => ({ limit: a.limit })
  },
  {
    name: 'nango.log.operation.get', purpose: 'Read one Nango operation log by operation ID.', risk: 'READ',
    requiredScope: 'environment:logs:read', upstream: 'logs_get_operation',
    schema: z.object({ operation_id: id }).strict(), map: (a) => ({ operation_id: a.operation_id })
  }
];

export async function invokeTool(client: NangoManagementClient, def: ToolDef, input: unknown): Promise<unknown> {
  const parsed = def.schema.parse(input);
  return client.call(def.upstream, def.map(parsed));
}
