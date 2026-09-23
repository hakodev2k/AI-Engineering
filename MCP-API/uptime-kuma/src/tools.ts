import { z } from 'zod';import type { KumaClient } from './client.js';import type { Config } from './config.js';import { authorize,type Risk } from './permissions.js';
const id=z.object({id:z.number().int().positive()}); const approval=z.object({approved:z.literal(true)});
export type ToolDef={name:string;description:string;risk:Risk;schema:z.ZodTypeAny;run:(a:any)=>Promise<any>};
export function tools(c:KumaClient,cfg:Config):ToolDef[]{return [
{name:'uptime_kuma.monitor.list',description:'List monitors',risk:'READ',schema:z.object({}),run:()=>c.listMonitors()},
{name:'uptime_kuma.monitor.get',description:'Get monitor configuration',risk:'READ',schema:id,run:a=>c.getMonitor(a.id)},
{name:'uptime_kuma.heartbeat.list',description:'Get recent monitor heartbeats',risk:'READ',schema:id.extend({period:z.number().int().min(1).max(720).default(24)}),run:a=>c.heartbeats(a.id,a.period)},
{name:'uptime_kuma.maintenance.list',description:'List maintenance windows',risk:'READ',schema:z.object({}),run:()=>c.maintenances()},
{name:'uptime_kuma.status_page.list',description:'List status pages',risk:'READ',schema:z.object({}),run:()=>c.statusPages()},
{name:'uptime_kuma.notification.list',description:'List notification configurations',risk:'READ',schema:z.object({}),run:()=>c.notifications()},
{name:'uptime_kuma.tag.list',description:'List monitor tags',risk:'READ',schema:z.object({}),run:()=>c.tags()},
{name:'uptime_kuma.monitor.create',description:'Create HTTP/Ping/TCP monitor',risk:'WRITE',schema:z.object({approved:z.literal(true),type:z.enum(['http','ping','port']),name:z.string().min(1).max(200),url:z.string().url().optional(),hostname:z.string().max(253).optional(),port:z.number().int().min(1).max(65535).optional(),interval:z.number().int().min(20).max(86400).default(60)}).superRefine((v,x)=>{if(v.type==='http'&&!v.url)x.addIssue({code:'custom',message:'url required'});if(v.type!=='http'&&!v.hostname)x.addIssue({code:'custom',message:'hostname required'})}),run:a=>{authorize(cfg,'WRITE',a.approved);return c.addMonitor(a)}},
{name:'uptime_kuma.monitor.update',description:'Update a monitor using a complete monitor object returned by monitor.get',risk:'WRITE',schema:z.object({approved:z.literal(true),monitor:z.record(z.unknown())}),run:a=>{authorize(cfg,'WRITE',a.approved);return c.editMonitor(a.monitor)}},
{name:'uptime_kuma.monitor.pause',description:'Pause monitoring',risk:'HIGH_RISK',schema:id.merge(approval),run:a=>{authorize(cfg,'HIGH_RISK',a.approved);return c.pause(a.id)}},
{name:'uptime_kuma.monitor.resume',description:'Resume monitoring',risk:'WRITE',schema:id.merge(approval),run:a=>{authorize(cfg,'WRITE',a.approved);return c.resume(a.id)}},
{name:'uptime_kuma.monitor.delete',description:'Permanently delete monitor',risk:'DESTRUCTIVE',schema:id.merge(approval),run:a=>{authorize(cfg,'DESTRUCTIVE',a.approved);return c.remove(a.id)}}];}
