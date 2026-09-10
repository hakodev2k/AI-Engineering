import { z } from 'zod';
import type { Config } from './config.js';
import { PingdomClient } from './client.js';
import { assertPolicy } from './policy.js';

const approval = z.string().regex(/^[a-f0-9]{64}$/).optional();
const id = z.number().int().positive();
const unixTime = z.number().int().nonnegative();
const limit = z.number().int().min(1).max(25000).default(100);
const offset = z.number().int().nonnegative().default(0);
const resolution = z.enum(['1','5','15','30','60']).transform(Number).optional();
const checkType = z.enum(['http','https','tcp','ping','dns','udp','smtp','pop3','imap']).optional();

export const schemas = {
  empty: z.object({}).strict(),
  checkList: z.object({ limit, offset, tags: z.string().max(1000).optional(), includeSeverity: z.boolean().optional(), includeTags: z.boolean().optional() }).strict(),
  checkGet: z.object({ checkId: id }).strict(),
  checkSummary: z.object({ checkId: id, from: unixTime, to: unixTime.optional(), includeUptime: z.boolean().optional(), byCountry: z.boolean().optional(), byProbe: z.boolean().optional(), probes: z.string().regex(/^\d+(,\d+)*$/).optional() }).strict(),
  probeList: z.object({ limit, offset, onlyActive: z.boolean().optional(), includeDeleted: z.boolean().optional() }).strict(),
  alertList: z.object({ checkIds: z.string().regex(/^\d+(,\d+)*$/).optional(), from: unixTime.optional(), to: unixTime.optional(), limit: z.number().int().min(1).max(1000).default(100), offset, status: z.enum(['successful','failing','unknown']).optional(), userIds: z.string().regex(/^\d+(,\d+)*$/).optional(), via: z.string().max(100).optional() }).strict(),
  maintenanceList: z.object({ from: unixTime.optional(), to: unixTime.optional() }).strict(),
  maintenanceGet: z.object({ id }).strict(),
  occurrenceList: z.object({ from: unixTime.optional(), to: unixTime.optional() }).strict(),
  checkCreate: z.object({ name: z.string().min(1).max(255), host: z.string().min(1).max(2048), type: checkType, resolution, paused: z.boolean().optional(), port: z.number().int().min(1).max(65535).optional(), approval }).strict(),
  checkUpdate: z.object({ checkId: id, name: z.string().min(1).max(255).optional(), host: z.string().min(1).max(2048).optional(), resolution, paused: z.boolean().optional(), port: z.number().int().min(1).max(65535).optional(), approval }).strict(),
  checkDelete: z.object({ checkId: id, approval }).strict(),
  maintenanceCreate: z.object({ description: z.string().min(1).max(1024), from: unixTime, to: unixTime, approval }).strict(),
  maintenanceUpdate: z.object({ id, description: z.string().min(1).max(1024).optional(), from: unixTime.optional(), to: unixTime.optional(), approval }).strict(),
  maintenanceDelete: z.object({ id, approval }).strict()
};

function query(args: Record<string, unknown>) {
  const map: Record<string, string> = { includeSeverity: 'include_severity', includeTags: 'include_tags', onlyActive: 'onlyactive', includeDeleted: 'includedeleted', checkIds: 'checkids', userIds: 'userids', includeUptime: 'includeuptime', byCountry: 'bycountry', byProbe: 'byprobe' };
  return Object.fromEntries(Object.entries(args).filter(([k]) => k !== 'approval').map(([k,v]) => [map[k] ?? k, v]));
}
function body(args: Record<string, unknown>, omit: string[] = []) {
  const map: Record<string, string> = { checkId: 'checkid' };
  return Object.fromEntries(Object.entries(args).filter(([k,v]) => k !== 'approval' && !omit.includes(k) && v !== undefined).map(([k,v]) => [map[k] ?? k, v]));
}

export async function invoke(client: PingdomClient, config: Config, tool: string, args: Record<string, unknown>): Promise<unknown> {
  assertPolicy(config, tool, args);
  switch (tool) {
    case 'pingdom.check.list': return client.request('GET', '/checks', { query: query(args) });
    case 'pingdom.check.get': return client.request('GET', `/checks/${args.checkId}`);
    case 'pingdom.check.summary': {
      const { checkId, ...rest } = args; return client.request('GET', `/summary.average/${checkId}`, { query: query(rest) });
    }
    case 'pingdom.probe.list': return client.request('GET', '/probes', { query: query(args) });
    case 'pingdom.alert.list': return client.request('GET', '/actions', { query: query(args) });
    case 'pingdom.maintenance.list': return client.request('GET', '/maintenance', { query: query(args) });
    case 'pingdom.maintenance.get': return client.request('GET', `/maintenance/${args.id}`);
    case 'pingdom.maintenance.occurrence.list': return client.request('GET', '/maintenance.occurrences', { query: query(args) });
    case 'pingdom.account.credits.get': return client.request('GET', '/credits');
    case 'pingdom.check.create': return client.request('POST', '/checks', { body: body(args) });
    case 'pingdom.check.update': return client.request('PUT', `/checks/${args.checkId}`, { body: body(args, ['checkId']) });
    case 'pingdom.check.delete': return client.request('DELETE', `/checks/${args.checkId}`);
    case 'pingdom.maintenance.create': {
      if ((args.to as number) <= (args.from as number)) throw new Error('to must be greater than from');
      return client.request('POST', '/maintenance', { body: body(args) });
    }
    case 'pingdom.maintenance.update': {
      if (args.from !== undefined && args.to !== undefined && (args.to as number) <= (args.from as number)) throw new Error('to must be greater than from');
      return client.request('PUT', `/maintenance/${args.id}`, { body: body(args, ['id']) });
    }
    case 'pingdom.maintenance.delete': return client.request('DELETE', `/maintenance/${args.id}`);
    default: throw new Error(`Unsupported tool: ${tool}`);
  }
}
