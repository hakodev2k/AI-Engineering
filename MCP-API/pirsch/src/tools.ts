import {z} from 'zod'; import {PirschClient} from './client.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export const specs={
 'pirsch.domain.list':{risk:'READ' as Risk,approval:false},
 'pirsch.statistics.visitors':{risk:'READ' as Risk,approval:false},'pirsch.statistics.pages':{risk:'READ' as Risk,approval:false},'pirsch.statistics.referrers':{risk:'READ' as Risk,approval:false},'pirsch.statistics.events':{risk:'READ' as Risk,approval:false},'pirsch.statistics.countries':{risk:'READ' as Risk,approval:false},'pirsch.statistics.devices':{risk:'READ' as Risk,approval:false},
 'pirsch.traffic.page_view.track':{risk:'WRITE' as Risk,approval:true},'pirsch.traffic.event.track':{risk:'WRITE' as Risk,approval:true}
};
const range=z.object({domainId:z.string().min(1).max(100),from:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),to:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)}).strict();
const hit=z.object({url:z.string().url().max(2048),ip:z.string().min(3).max(64),user_agent:z.string().min(1).max(1024),accept_language:z.string().max(256).optional(),referrer:z.string().url().max(2048).optional(),tags:z.record(z.string().max(256)).optional(),approved:z.boolean().optional()}).strict();
const event=hit.extend({event_name:z.string().min(1).max(128),event_meta:z.record(z.string().max(512)).optional()}).strict();
const q=(p:any)=>`?id=${encodeURIComponent(p.domainId)}&from=${p.from}&to=${p.to}`;
export async function invoke(name:string,input:unknown,c=new PirschClient()){
 if(!(name in specs))throw new Error('Unknown tool'); const spec=specs[name as keyof typeof specs];
 if(spec.approval&&process.env.PIRSCH_REQUIRE_WRITE_APPROVAL!=='false'&&!(input as any)?.approved)throw new Error('Explicit human approval required');
 if(name==='pirsch.domain.list')return c.get('/api/v1/domain');
 const map:Record<string,string>={'pirsch.statistics.visitors':'visitor','pirsch.statistics.pages':'page','pirsch.statistics.referrers':'referrer','pirsch.statistics.events':'event','pirsch.statistics.countries':'country','pirsch.statistics.devices':'device'};
 if(map[name]){const p=range.parse(input);return c.get(`/api/v1/statistics/${map[name]}${q(p)}`)}
 if(name==='pirsch.traffic.page_view.track'){const p=hit.parse(input);const {approved,...body}=p;return c.post('/api/v1/hit',body)}
 if(name==='pirsch.traffic.event.track'){const p=event.parse(input);const {approved,...body}=p;return c.post('/api/v1/event',body)}
 throw new Error('Unsupported tool');
}
export const schemas={range,hit,event};
