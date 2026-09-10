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
  checkGet: z.object({ checkId: id, includeTeams: z.boolean().optional() }).strict(),
  checkSummary: z.object({ checkId: id, from: unixTime, to: unixTime.optional(), includeUptime: z.boolean().optional(), byCountry: z.boolean().optional(), byProbe: z.boolean().optional(), probes: z.string().regex(/^\d+(,\d+)*$/).optional() }).strict(),
  probeList: z.object({ limit, offset, onlyActive: z.boolean().optional(), includeDeleted: z.boolean().optional() }).strict(),
  alertList: z.object({ checkIds: z.string().regex(/^\d+(,\d+)*$/).optional(), from: unixTime.optional(), to: unixTime.optional(), limit: z.number().int().min(1).max(1000).default(100), offset, status: z.enum(['successful','failing','unknown']).optional(), userIds: z.string().regex(/^\d+(,\d+)*$/).optional(), via: z.string().max(100).optional() }).strict(),
  maintenanceList: z.object({ limit: z.number().int().min(1).max(1000).default(100), offset, order: z.enum(['asc','desc']).optional(), orderBy: z.enum(['description','from','to','effectiveto']).optional() }).strict(),
  maintenanceGet: z.object({ id }).strict(),
  occurrenceList: z.object({ from: unixTime.optional(), to: unixTime.optional(), maintenanceId: id.optional() }).strict(),
  checkCreate: z.object({ name: z.string().min(1).max(255), hostname: z.string().min(1).max(2048), type: checkType, resolution, paused: z.boolean().optional(), port: z.number().int().min(1).max(65535).optional(), approval }).strict(),
  checkUpdate: z.object({ checkId: id, name: z.string().min(1).max(255).optional(), hostname: z.string().min(1).max(2048).optional(), resolution, paused: z.boolean().optional(), port: z.number().int().min(1).max(65535).optional(), approval }).strict(),
  checkDelete: z.object({ checkId: id, approval }).strict(),
  maintenanceCreate: z.object({ description: z.string().min(1).max(1024), from: unixTime, to: unixTime, effectiveTo: unixTime.optional(), recurrenceType: z.enum(['none','day','week','month']).optional(), repeatEvery: z.number().int().nonnegative().optional(), uptimeIds: z.array(id).max(500).optional(), tmsIds: z.array(id).max(500).optional(), approval }).strict(),
  maintenanceUpdate: z.object({ id, description: z.string().min(1).max(1024).optional(), from: unixTime.optional(), to: unixTime.optional(), effectiveTo: unixTime.optional(), recurrenceType: z.enum(['none','day','week','month']).optional(), repeatEvery: z.number().int().nonnegative().optional(), uptimeIds: z.array(id).max(500).optional(), tmsIds: z.array(id).max(500).optional(), approval }).strict(),
  maintenanceDelete: z.object({ id, approval }).strict()
};

const names: Record<string, string> = {
  includeSeverity: 'include_severity', includeTags: 'include_tags', includeTeams: 'include_teams', onlyActive: 'onlyactive', includeDeleted: 'includedeleted',
  checkIds: 'checkids', userIds: 'userids', includeUptime: 'includeuptime', byCountry: 'bycountry', byProbe: 'byprobe', orderBy: 'orderby',
  maintenanceId: 'maintenanceid', effectiveTo: 'effectiveto', recurrenceType: 'recurrencetype', repeatEvery: 'repeatevery', uptimeIds: 'uptimeids', tmsIds: 'tmsids'
};
function convert(args: Record<string, unknown>, omit: string[] = []) {
  return Object.fromEntries(Object.entries(args).filter(([k,v]) => k !== 'approval' && !omit.includes(k) && v !== undefined).map(([k,v]) => [names[k] ?? k, Array.isArray(v) ? v.join(',') : v]));
}

export async function invoke(client: PingdomClient, config: Config, tool: string, args: Record<string, unknown>): Promise<unknown> {
  assertPolicy(config, tool, args);
  switch (tool) {
    case 'pingdom.check.list': return client.request('GET', '/checks', { query: convert(args) });
    case 'pingdom.check.get': { const { checkId, ...rest } = args; return client.request('GET', `/checks/${checkId}`, { query: convert(rest) }); }
    case 'pingdom.check.summary': { const { checkId, ...rest } = args; return client.request('GET', `/summary.average/${checkId}`, { query: convert(rest) }); }
    case 'pingdom.probe.list': return client.request('GET', '/probes', { query: convert(args) });
    case 'pingdom.alert.list': return client.request('GET', '/actions', { query: convert(args) });
    case 'pingdom.maintenance.list': return client.request('GET', '/maintenance', { query: convert(args) });
    case 'pingdom.maintenance.get': return client.request('GET', `/maintenance/${args.id}`);
    case 'pingdom.maintenance.occurrence.list': return client.request('GET', '/maintenance.occurrences', { query: convert(args) });
    case 'pingdom.account.credits.get': return client.request('GET', '/credits');
    case 'pingdom.check.create': return client.request('POST', '/checks', { body: convert(args) });
    case 'pingdom.check.update': return client.request('PUT', `/checks/${args.checkId}`, { body: convert(args, ['checkId']) });
    case 'pingdom.check.delete': return client.request('DELETE', '/checks', { body: { delcheckids: String(args.checkId) } });
    case 'pingdom.maintenance.create': {
      if ((args.to as number) <= (args.from as number)) throw new Error('to must be greater than from');
      return client.request('POST', '/maintenance', { body: convert(args) });
    }
    case 'pingdom.maintenance.update': {
      if (args.from !== undefined && args.to !== undefined && (args.to as number) <= (args.from as number)) throw new Error('to must be greater than from');
      return client.request('PUT', `/maintenance/${args.id}`, { body: convert(args, ['id']) });
    }
    case 'pingdom.maintenance.delete': return client.request('DELETE', `/maintenance/${args.id}`);
    default: throw new Error(`Unsupported tool: ${tool}`);
  }
}
