import {z} from 'zod';import type{KongClient}from './client.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';export type Tool={name:string;description:string;risk:Risk;approval:boolean;schema:z.ZodTypeAny;run:(x:any)=>Promise<unknown>};
const id=z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);const page=z.number().int().min(1).max(100).default(25);const q=z.string().max(200).optional();
const t=(name:string,description:string,risk:Risk,schema:z.ZodTypeAny,run:Tool['run'],approval=risk!=='READ'):Tool=>({name,description,risk,approval,schema,run});
export function tools(c:KongClient):Tool[]{return[
t('kong.control-plane.list','List Konnect control planes.','READ',z.object({pageSize:page}).strict(),x=>c.request('GET','/v2/control-planes',undefined,{page_size:x.pageSize})),
t('kong.control-plane.get','Get a control plane.','READ',z.object({controlPlaneId:id}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}`)),
t('kong.service.list','List Gateway Services in a control plane.','READ',z.object({controlPlaneId:id,pageSize:page}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/services`,undefined,{size:x.pageSize})),
t('kong.service.get','Get a Gateway Service.','READ',z.object({controlPlaneId:id,serviceId:id}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/services/${encodeURIComponent(x.serviceId)}`)),
t('kong.route.list','List Gateway Routes.','READ',z.object({controlPlaneId:id,pageSize:page}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/routes`,undefined,{size:x.pageSize})),
t('kong.route.get','Get a Gateway Route.','READ',z.object({controlPlaneId:id,routeId:id}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/routes/${encodeURIComponent(x.routeId)}`)),
t('kong.consumer.list','List Gateway Consumers.','READ',z.object({controlPlaneId:id,pageSize:page}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/consumers`,undefined,{size:x.pageSize})),
t('kong.plugin.list','List Gateway plugin configurations.','READ',z.object({controlPlaneId:id,pageSize:page}).strict(),x=>c.request('GET',`/v2/control-planes/${encodeURIComponent(x.controlPlaneId)}/core-entities/plugins`,undefined,{size:x.pageSize})),
t('kong.catalog.mcp-server.list','List registered MCP servers in Konnect Catalog.','READ',z.object({pageSize:page,query:q}).strict(),x=>c.request('GET','/v1/mcp-servers',undefined,{page_size:x.pageSize,q:x.query})),
t('kong.catalog.mcp-server.create','Register MCP server metadata in Konnect Catalog; does not deploy a server.','WRITE',z.object({name:z.string().regex(/^[a-z0-9][a-z0-9-_]{0,62}$/),displayName:z.string().min(1).max(120),description:z.string().max(1000).optional()}).strict(),x=>c.request('POST','/v1/mcp-servers',{name:x.name,display_name:x.displayName,description:x.description})),
]}
export async function execute(tool:Tool,input:unknown,approved=false){const parsed=tool.schema.parse(input);if(tool.approval&&!approved)throw new Error(`Human approval required for ${tool.name} (${tool.risk})`);return tool.run(parsed)}
