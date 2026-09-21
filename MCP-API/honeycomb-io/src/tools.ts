import {z} from 'zod'; import type {HoneycombClient} from './client.js'; import {requireApproval,untrusted,type Risk} from './policy.js';
const slug=z.string().min(1).max(255).regex(/^[A-Za-z0-9._~-]+$/); const id=z.string().min(1).max(255).regex(/^[A-Za-z0-9_-]+$/);
const approved=z.boolean().optional();
export type ToolDef={name:string;description:string;risk:Risk;approval:boolean;schema:z.ZodTypeAny;run:(x:any)=>Promise<unknown>};
export function buildTools(c:HoneycombClient, requireWrites=true):ToolDef[]{
 const read=(name:string,description:string,schema:z.ZodTypeAny,path:(x:any)=>string):ToolDef=>({name,description,risk:'READ',approval:false,schema,run:async x=>untrusted(await c.request('GET',path(x)))});
 const write=(name:string,description:string,schema:z.ZodTypeAny,path:(x:any)=>string,body:(x:any)=>unknown):ToolDef=>({name,description,risk:'WRITE',approval:requireWrites,schema,run:async x=>{requireApproval('WRITE',x.approved,requireWrites);return untrusted(await c.request('POST',path(x),body(x)));}});
 return [
  read('honeycomb.dataset.list','List datasets.',z.object({}).strict(),()=>'/1/datasets'),
  read('honeycomb.dataset.get','Get one dataset.',z.object({dataset:slug}).strict(),x=>`/1/datasets/${encodeURIComponent(x.dataset)}`),
  write('honeycomb.dataset.create','Create a dataset.',z.object({name:z.string().min(1).max(255),description:z.string().max(1024).optional(),approved}).strict(),()=>'/1/datasets',x=>({name:x.name,description:x.description})),
  read('honeycomb.board.list','List boards.',z.object({}).strict(),()=>'/1/boards'),
  read('honeycomb.board.get','Get a board.',z.object({boardId:id}).strict(),x=>`/1/boards/${encodeURIComponent(x.boardId)}`),
  write('honeycomb.board.create','Create a flexible board.',z.object({name:z.string().min(1).max(255),description:z.string().max(1024).optional(),approved}).strict(),()=>'/1/boards',x=>({name:x.name,type:'flexible',description:x.description,panels:[]})),
  read('honeycomb.slo.list','List SLOs for a dataset.',z.object({dataset:slug}).strict(),x=>`/1/slos/${encodeURIComponent(x.dataset)}`),
  read('honeycomb.slo.get','Get an SLO.',z.object({dataset:slug,sloId:id}).strict(),x=>`/1/slos/${encodeURIComponent(x.dataset)}/${encodeURIComponent(x.sloId)}`),
  read('honeycomb.trigger.list','List triggers for a dataset.',z.object({dataset:slug}).strict(),x=>`/1/triggers/${encodeURIComponent(x.dataset)}`),
  read('honeycomb.trigger.get','Get a trigger.',z.object({dataset:slug,triggerId:id}).strict(),x=>`/1/triggers/${encodeURIComponent(x.dataset)}/${encodeURIComponent(x.triggerId)}`),
  read('honeycomb.marker.list','List markers for a dataset.',z.object({dataset:slug}).strict(),x=>`/1/markers/${encodeURIComponent(x.dataset)}`),
  write('honeycomb.marker.create','Create a deployment/change marker.',z.object({dataset:slug,message:z.string().min(1).max(1024),type:z.string().min(1).max(255).optional(),url:z.string().url().max(2048).optional(),approved}).strict(),x=>`/1/markers/${encodeURIComponent(x.dataset)}`,x=>({message:x.message,type:x.type,url:x.url}))
 ];
}
