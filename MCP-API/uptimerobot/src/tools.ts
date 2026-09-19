import { z } from 'zod'; import { UptimeRobotClient } from './client.js'; import { authorize,Id,Page,safeText,targetUrl,type Policy,type Risk } from './security.js';
export type Def={name:string;risk:Risk;description:string;schema:z.ZodTypeAny;run:(a:any)=>Promise<any>};
const A=z.boolean().optional();
export function tools(c:UptimeRobotClient,p:Policy):Def[]{
 const q=(a:any)=>{const s=new URLSearchParams();if(a.cursor)s.set('cursor',a.cursor);s.set('limit',String(a.limit));return s.toString()};
 const defs:Def[]=[
 {name:'uptimerobot.monitor.list',risk:'READ',description:'List monitors with bounded cursor pagination.',schema:Page,run:a=>c.request('GET','/monitors?'+q(a))},
 {name:'uptimerobot.monitor.get',risk:'READ',description:'Get one monitor.',schema:z.object({id:Id}).strict(),run:a=>c.request('GET',`/monitors/${a.id}`)},
 {name:'uptimerobot.monitor.create',risk:'WRITE',description:'Create an HTTP(S) monitor.',schema:z.object({friendlyName:safeText(120),url:targetUrl,interval:z.number().int().min(60).max(86400),timeout:z.number().int().min(1).max(60).optional(),approved:A}).strict(),run:a=>c.request('POST','/monitors',{type:'http',friendly_name:a.friendlyName,url:a.url,interval:a.interval,timeout:a.timeout},false)},
 {name:'uptimerobot.monitor.update',risk:'WRITE',description:'Update safe mutable monitor fields.',schema:z.object({id:Id,friendlyName:safeText(120).optional(),url:targetUrl.optional(),interval:z.number().int().min(60).max(86400).optional(),timeout:z.number().int().min(1).max(60).optional(),approved:A}).strict().refine(x=>x.friendlyName||x.url||x.interval||x.timeout,'At least one change required'),run:a=>c.request('PATCH',`/monitors/${a.id}`,{friendly_name:a.friendlyName,url:a.url,interval:a.interval,timeout:a.timeout},false)},
 {name:'uptimerobot.monitor.pause',risk:'WRITE',description:'Pause a monitor.',schema:z.object({id:Id,approved:A}).strict(),run:a=>c.request('POST',`/monitors/${a.id}/pause`,{},false)},
 {name:'uptimerobot.monitor.start',risk:'WRITE',description:'Start a paused monitor.',schema:z.object({id:Id,approved:A}).strict(),run:a=>c.request('POST',`/monitors/${a.id}/start`,{},false)},
 {name:'uptimerobot.monitor.delete',risk:'DESTRUCTIVE',description:'Permanently delete a monitor through API v3; disabled by default.',schema:z.object({id:Id,approved:z.literal(true)}).strict(),run:a=>c.request('DELETE',`/monitors/${a.id}`,undefined,false)},
 {name:'uptimerobot.incident.list',risk:'READ',description:'List incidents.',schema:Page,run:a=>c.request('GET','/incidents?'+q(a))},
 {name:'uptimerobot.status-page.list',risk:'READ',description:'List public status pages.',schema:Page,run:a=>c.request('GET','/psps?'+q(a))},
 {name:'uptimerobot.maintenance-window.list',risk:'READ',description:'List maintenance windows.',schema:Page,run:a=>c.request('GET','/maintenance-windows?'+q(a))}
 ];
 return defs.map(d=>({...d,run:async a=>{const parsed=d.schema.parse(a);authorize(d.risk,parsed.approved,p);return d.run(parsed)}}));
}
