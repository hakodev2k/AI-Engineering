import { z } from 'zod';
import type { UnkeyClient } from './client.js';
import type { Risk } from './policy.js';

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  permission: string;
  schema: Record<string, z.ZodTypeAny>;
  run: (args: any) => Promise<unknown>;
};

const id = (prefix: string) => z.string().min(prefix.length + 2).max(255).refine(v => v.startsWith(prefix), `must start with ${prefix}`);
const cursor = z.string().min(1).max(1024).optional();
const approved = z.boolean().optional();

export function buildTools(api: UnkeyClient): ToolDef[] {
  return [
    {
      name: 'unkey.api.create', description: 'Create a new Unkey API/keyspace.', risk: 'WRITE', permission: 'api.*.create_api',
      schema: { name: z.string().min(1).max(255), approved },
      run: ({ name }: any) => api.call('apis.createApi', { name }, false),
    },
    {
      name: 'unkey.api.get', description: 'Read an API/keyspace by ID.', risk: 'READ', permission: 'api.{apiId}.read_api',
      schema: { api_id: id('api_') },
      run: ({ api_id }: any) => api.call('apis.getApi', { apiId: api_id }),
    },
    {
      name: 'unkey.key.list', description: 'List keys for one API. Plaintext decryption is intentionally unsupported.', risk: 'READ', permission: 'api.{apiId}.read_key',
      schema: { api_id: id('api_'), limit: z.number().int().min(1).max(100).optional(), cursor },
      run: ({ api_id, ...rest }: any) => api.call('keys.listKeys', { apiId: api_id, ...rest, decrypt: false }),
    },
    {
      name: 'unkey.key.get', description: 'Read key metadata by key ID. Plaintext decryption is intentionally unsupported.', risk: 'READ', permission: 'api.{apiId}.read_key',
      schema: { key_id: id('key_') },
      run: ({ key_id }: any) => api.call('keys.getKey', { keyId: key_id, decrypt: false }),
    },
    {
      name: 'unkey.key.create', description: 'Issue a new API credential. Returned plaintext is sensitive and should be delivered directly to the intended recipient.', risk: 'HIGH_RISK', permission: 'api.{apiId}.create_key',
      schema: {
        api_id: id('api_'), name: z.string().min(1).max(255).optional(), prefix: z.string().regex(/^[A-Za-z0-9_-]{1,16}$/).optional(),
        external_id: z.string().min(1).max(255).optional(), expires: z.number().int().positive().optional(), enabled: z.boolean().optional(),
        remaining_credits: z.number().int().min(0).optional(), approved,
      },
      run: ({ api_id, external_id, remaining_credits, approved: _approved, ...rest }: any) => api.call('keys.createKey', {
        apiId: api_id, externalId: external_id, recoverable: false, ...rest,
        ...(remaining_credits == null ? {} : { credits: { remaining: remaining_credits } }),
      }, false),
    },
    {
      name: 'unkey.key.update', description: 'Update key name, enablement, expiration, or remaining credits.', risk: 'HIGH_RISK', permission: 'api.{apiId}.update_key',
      schema: {
        key_id: id('key_'), name: z.string().min(1).max(255).optional(), enabled: z.boolean().optional(), expires: z.number().int().positive().nullable().optional(),
        remaining_credits: z.number().int().min(0).optional(), approved,
      },
      run: ({ key_id, remaining_credits, approved: _approved, ...rest }: any) => api.call('keys.updateKey', {
        keyId: key_id, ...rest, ...(remaining_credits == null ? {} : { credits: { remaining: remaining_credits } }),
      }, false),
    },
    {
      name: 'unkey.key.verify', description: 'Verify an API key. Verification can consume configured credits/rate-limit quota.', risk: 'WRITE', permission: 'api.{apiId}.verify_key',
      schema: { key: z.string().min(8).max(4096), api_id: id('api_').optional(), credit_cost: z.number().int().min(0).max(1_000_000).optional(), approved },
      run: ({ key, api_id, credit_cost, approved: _approved }: any) => api.call('keys.verifyKey', {
        key, ...(api_id ? { apiId: api_id } : {}), ...(credit_cost == null ? {} : { credits: { cost: credit_cost } }),
      }, false),
    },
    {
      name: 'unkey.key.reroll', description: 'Reroll a key while preserving its configuration; this rotates credentials.', risk: 'HIGH_RISK', permission: 'api.{apiId}.update_key',
      schema: { key_id: id('key_'), approved },
      run: ({ key_id }: any) => api.call('keys.rerollKey', { keyId: key_id }, false),
    },
    {
      name: 'unkey.key.delete', description: 'Permanently delete/revoke a key.', risk: 'DESTRUCTIVE', permission: 'api.{apiId}.delete_key',
      schema: { key_id: id('key_'), approved },
      run: ({ key_id }: any) => api.call('keys.deleteKey', { keyId: key_id }, false),
    },
    {
      name: 'unkey.ratelimit.limit', description: 'Check and enforce a standalone rate limit; cost consumes quota.', risk: 'WRITE', permission: 'ratelimit.*.limit',
      schema: { namespace: z.string().min(1).max(255), identifier: z.string().min(1).max(255), limit: z.number().int().positive(), duration_ms: z.number().int().min(1000), cost: z.number().int().min(0).optional(), approved },
      run: ({ duration_ms, approved: _approved, ...rest }: any) => api.call('ratelimit.limit', { ...rest, duration: duration_ms }, false),
    },
    {
      name: 'unkey.ratelimit.override.set', description: 'Create or replace a rate-limit override for an identifier or wildcard pattern.', risk: 'HIGH_RISK', permission: 'ratelimit.*.set_override',
      schema: { namespace: z.string().min(1).max(255), identifier: z.string().min(1).max(255), limit: z.number().int().min(0), duration_ms: z.number().int().min(1000), approved },
      run: ({ duration_ms, approved: _approved, ...rest }: any) => api.call('ratelimit.setOverride', { ...rest, duration: duration_ms }, false),
    },
  ];
}
