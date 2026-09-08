import { z } from 'zod';
import { AkamaiClient } from './client.js';
import { assertAllowed, TOOL_POLICY } from './policy.js';
import { cpCodesSchema, idSchema, networkSchema, objectsStringSchema, papiNetworkSchema } from './config.js';

const ctxSchema = {
  contractId: idSchema.optional(),
  groupId: idSchema.optional(),
};

const propertyList = z.object({
  ...ctxSchema,
  modifiedSince: z.string().max(64).optional(),
  modifiedNetwork: papiNetworkSchema,
});
const propertyGet = z.object({ propertyId: idSchema, ...ctxSchema });
const hostnamesList = z.object({ propertyId: idSchema, ...ctxSchema, offset: z.number().int().min(0).optional(), limit: z.number().int().min(1).max(1000).optional() });
const activationList = z.object({ propertyId: idSchema, ...ctxSchema });
const activationGet = z.object({ propertyId: idSchema, activationId: idSchema, ...ctxSchema });
const activationCreate = z.object({
  propertyId: idSchema,
  propertyVersion: z.number().int().min(1),
  network: z.enum(['STAGING', 'PRODUCTION']),
  notifyEmails: z.array(z.string().email()).min(1).max(20),
  note: z.string().max(1000).optional(),
  acknowledgeAllWarnings: z.boolean().default(false),
  useFastFallback: z.boolean().default(false),
  approved: z.literal(true),
  ...ctxSchema,
});
const purgeRate = z.object({ purgeType: z.enum(['url', 'cpcode', 'tag']) });
const purgeUrl = z.object({ network: networkSchema, objects: objectsStringSchema, approved: z.literal(true) });
const purgeCp = z.object({ network: networkSchema, objects: cpCodesSchema, approved: z.literal(true) });
const purgeTag = z.object({ network: networkSchema, objects: z.array(z.string().min(1).max(128)).min(1).max(5000), approved: z.literal(true) });

export const TOOL_DEFINITIONS = [
  { name: 'akamai.property.list', description: 'List Property Manager properties available to the API client.', schema: propertyList },
  { name: 'akamai.property.get', description: 'Get metadata for one Property Manager property.', schema: propertyGet },
  { name: 'akamai.property.hostnames.list', description: 'List active hostnames assigned to a property.', schema: hostnamesList },
  { name: 'akamai.activation.list', description: 'List staging and production activations for a property.', schema: activationList },
  { name: 'akamai.activation.get', description: 'Get activation status and details.', schema: activationGet },
  { name: 'akamai.activation.create', description: 'Activate a specific property version on staging or production. Explicit approval required.', schema: activationCreate },
  { name: 'akamai.purge.rate_limit.get', description: 'Check Fast Purge rate and object limit status.', schema: purgeRate },
  { name: 'akamai.purge.url.invalidate', description: 'Invalidate cached URL/ARL objects. Explicit approval required.', schema: purgeUrl },
  { name: 'akamai.purge.cpcode.invalidate', description: 'Invalidate cached content by CP code. Explicit approval required.', schema: purgeCp },
  { name: 'akamai.purge.tag.invalidate', description: 'Invalidate cached content by cache tag. Explicit approval required.', schema: purgeTag },
] as const;

function query(input: any) {
  return { contractId: input.contractId, groupId: input.groupId, modifiedSince: input.modifiedSince, modifiedNetwork: input.modifiedNetwork, offset: input.offset, limit: input.limit };
}

export async function executeTool(client: AkamaiClient, name: string, raw: unknown): Promise<unknown> {
  const def = TOOL_DEFINITIONS.find(t => t.name === name);
  if (!def) throw new Error(`Unknown Akamai tool: ${name}`);
  const input: any = def.schema.parse(raw);
  assertAllowed(name, input.approved);
  switch (name) {
    case 'akamai.property.list':
      return client.request({ method: 'GET', path: '/papi/v1/properties', query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, retrySafe: true });
    case 'akamai.property.get':
      return client.request({ method: 'GET', path: `/papi/v1/properties/${encodeURIComponent(input.propertyId)}`, query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, retrySafe: true });
    case 'akamai.property.hostnames.list':
      return client.request({ method: 'GET', path: `/papi/v1/properties/${encodeURIComponent(input.propertyId)}/hostnames`, query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, retrySafe: true });
    case 'akamai.activation.list':
      return client.request({ method: 'GET', path: `/papi/v1/properties/${encodeURIComponent(input.propertyId)}/activations`, query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, retrySafe: true });
    case 'akamai.activation.get':
      return client.request({ method: 'GET', path: `/papi/v1/properties/${encodeURIComponent(input.propertyId)}/activations/${encodeURIComponent(input.activationId)}`, query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, retrySafe: true });
    case 'akamai.activation.create':
      return client.request({ method: 'POST', path: `/papi/v1/properties/${encodeURIComponent(input.propertyId)}/activations`, query: query(input), headers: { 'PAPI-Use-Prefixes': 'true' }, body: { propertyVersion: input.propertyVersion, network: input.network, notifyEmails: input.notifyEmails, note: input.note, acknowledgeAllWarnings: input.acknowledgeAllWarnings, useFastFallback: input.useFastFallback } });
    case 'akamai.purge.rate_limit.get':
      return client.request({ method: 'POST', path: `/ccu/v3/rate-limit-status/${input.purgeType}`, body: {}, retrySafe: false });
    case 'akamai.purge.url.invalidate':
      return client.request({ method: 'POST', path: `/ccu/v3/invalidate/url/${input.network}`, body: { objects: input.objects } });
    case 'akamai.purge.cpcode.invalidate':
      return client.request({ method: 'POST', path: `/ccu/v3/invalidate/cpcode/${input.network}`, body: { objects: input.objects } });
    case 'akamai.purge.tag.invalidate':
      return client.request({ method: 'POST', path: `/ccu/v3/invalidate/tag/${input.network}`, body: { objects: input.objects } });
    default:
      throw new Error(`Unimplemented Akamai tool: ${name}`);
  }
}

export function toolMetadata(name: string) {
  return TOOL_POLICY[name];
}
