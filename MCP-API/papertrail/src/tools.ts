import {z} from 'zod';import type {PapertrailClient} from './client.js';import type {PapertrailConfig} from './auth.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export const definitions=[
 ['papertrail.event.search','READ'],['papertrail.system.list','READ'],['papertrail.system.get','READ'],['papertrail.group.list','READ'],['papertrail.group.get','READ'],['papertrail.search.list','READ'],['papertrail.search.get','READ'],['papertrail.search.create','WRITE'],['papertrail.search.update','WRITE'],['papertrail.archive.list','READ'],['papertrail.usage.get','READ']
] as const;
const id=z.coerce.number().int().positive(); const searchInput=z.object({q:z.string().max(500).optional(),system_id:z.union([z.string(),id]).optional(),group_id:z.union([z.string(),id]).optional(),min_time:z.coerce.number().int().optional(),max_time:z.coerce.number().int().optional(),limit:z.coerce.number().int().min(1).max(10000).optional()}).strict();
const writeInput=z.object({name:z.string().min(1).max(200),query:z.string().min(1).max(1000),group_id:id.optional(),approved:z.boolean().default(false)}).strict();
function approve(c:PapertrailConfig,a:boolean){if(!c.allowWrites)throw new Error('WRITE disabled: set PAPERTRAIL_ALLOW_WRITES=true');if(!a)throw new Error('Human approval required for WRITE operation');}
export async function execute(name:string,input:unknown,c:PapertrailClient,cfg:PapertrailConfig){
 switch(name){
  case 'papertrail.event.search':return c.searchEvents(searchInput.parse(input));case 'papertrail.system.list':return c.listSystems();case 'papertrail.system.get':return c.getSystem(id.parse((input as any)?.id));
  case 'papertrail.group.list':return c.listGroups();case 'papertrail.group.get':return c.getGroup(id.parse((input as any)?.id));case 'papertrail.search.list':return c.listSearches();case 'papertrail.search.get':return c.getSearch(id.parse((input as any)?.id));
  case 'papertrail.search.create':{const p=writeInput.parse(input);approve(cfg,p.approved);return c.createSearch(p.name,p.query,p.group_id)}
  case 'papertrail.search.update':{const p=writeInput.extend({id}).parse(input);approve(cfg,p.approved);return c.updateSearch(p.id,p.name,p.query,p.group_id)}
  case 'papertrail.archive.list':return c.listArchives();case 'papertrail.usage.get':return c.usage();default:throw new Error('Unknown tool');
 }
}
export function schemaFor(name:string){if(name==='papertrail.event.search')return searchInput;if(name==='papertrail.search.create')return writeInput;if(name==='papertrail.search.update')return writeInput.extend({id});if(name.endsWith('.get'))return z.object({id}).strict();return z.object({}).strict()}
