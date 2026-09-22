import { z } from 'zod'; import { Risk, enforce } from './policy.js';
const approval=z.string().regex(/^[a-f0-9]{64}$/).optional(); const id=z.number().int().positive(); const uuid=z.string().uuid();
const alertBody=z.object({title:z.string().min(1).max(200),description:z.string().max(4000).optional(),tags:z.array(z.string().max(100)).max(10).optional(),enabled:z.boolean().optional(),searchTimeFrameMinutes:z.number().int().min(5).max(1440).optional(),subComponents:z.array(z.record(z.any())).min(1).max(2)}).strict();
export const definitions=[
 ['logz-io.log.search',Risk.READ,z.object({query:z.record(z.any()).default({}),from:z.number().int().min(0).max(10000).default(0),size:z.number().int().min(1).max(1000).default(50)}).strict(),(c,a,s)=>c.request('POST','/v1/search',{body:a,signal:s})],
 ['logz-io.alert.list',Risk.READ,z.object({from:z.number().int().min(0).default(0),size:z.number().int().min(1).max(100).default(50)}).strict(),(c,a,s)=>c.request('GET','/v2/alerts',{query:a,signal:s})],
 ['logz-io.alert.get',Risk.READ,z.object({alertId:id}).strict(),(c,a,s)=>c.request('GET',`/v2/alerts/${a.alertId}`,{signal:s})],
 ['logz-io.alert.triggered.list',Risk.READ,z.object({from:z.number().int().min(0).default(0),size:z.number().int().min(1).max(100).default(50),search:z.string().max(200).optional(),severity:z.enum(['SEVERE','HIGH','MEDIUM','LOW','INFO']).optional()}).strict(),(c,a,s)=>{const q={from:a.from,size:a.size,search:a.search,severities:a.severity}; return c.request('POST','/v1/alerts/triggered-alerts',{query:q,body:{},signal:s});}],
 ['logz-io.alert.create',Risk.HIGH_RISK,alertBody.extend({approvalToken:approval}).strict(),(c,a,s)=>{const {approvalToken,...body}=a; return c.request('POST','/v2/alerts',{body,signal:s});}],
 ['logz-io.alert.delete',Risk.DESTRUCTIVE,z.object({alertId:id,confirmAlertId:id,approvalToken:approval}).strict().refine(v=>v.alertId===v.confirmAlertId,'confirmAlertId must match alertId'),(c,a,s)=>c.request('DELETE',`/v2/alerts/${a.alertId}`,{signal:s})],
 ['logz-io.dashboard.list',Risk.READ,z.object({}).strict(),(c,a,s)=>c.request('GET','/perses-public/api/v1/dashboards',{signal:s})],
 ['logz-io.dashboard.folder.get',Risk.READ,z.object({projectId:uuid}).strict(),(c,a,s)=>c.request('GET',`/perses-public/api/v1/projects/${a.projectId}`,{signal:s})],
 ['logz-io.dashboard.folder.list_dashboards',Risk.READ,z.object({projectId:uuid}).strict(),(c,a,s)=>c.request('GET',`/perses-public/api/v1/projects/${a.projectId}/dashboards`,{signal:s})],
 ['logz-io.dashboard.creators.list',Risk.READ,z.object({}).strict(),(c,a,s)=>c.request('GET','/perses-public/api/v1/dashboards/users',{signal:s})]
];
export function invoke(config,client,def,args,signal){ const [name,risk,schema,handler]=def; const parsed=schema.parse(args); enforce(config,name,risk,parsed); return handler(client,parsed,signal); }
