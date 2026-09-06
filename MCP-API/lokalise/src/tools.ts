import { z } from "zod";
import type { Risk } from "./policy.js";
const projectId=z.string().min(1).max(80); const id=z.union([z.string().min(1).max(100),z.number().int().nonnegative()]);
const page=z.number().int().min(1).max(100000).optional(); const limit=z.number().int().min(1).max(5000).optional(); const approved=z.boolean().optional();
type T={name:string;description:string;risk:Risk;schema:z.ZodTypeAny;inputSchema:Record<string,unknown>};
function tool(name:string,description:string,risk:Risk,schema:z.ZodTypeAny,properties:Record<string,unknown>,required:string[]=[]):T{return{name,description,risk,schema,inputSchema:{type:"object",properties,required,additionalProperties:false}}}
const S={projectId:{type:"string"},page:{type:"integer",minimum:1},limit:{type:"integer",minimum:1},approved:{type:"boolean",description:"Explicit human approval for write execution."}};
export const TOOLS:T[]=[
 tool("lokalise.project.list","List accessible Lokalise projects.","READ",z.object({page,limit}).strict(),{page:S.page,limit:S.limit}),
 tool("lokalise.project.get","Get project metadata.","READ",z.object({projectId}).strict(),{projectId:S.projectId},["projectId"]),
 tool("lokalise.language.list","List project languages.","READ",z.object({projectId}).strict(),{projectId:S.projectId},["projectId"]),
 tool("lokalise.key.list","List/search project keys.","READ",z.object({projectId,page,limit,filterKeys:z.string().max(2000).optional()}).strict(),{projectId:S.projectId,page:S.page,limit:S.limit,filterKeys:{type:"string"}},["projectId"]),
 tool("lokalise.key.get","Get a key.","READ",z.object({projectId,keyId:id}).strict(),{projectId:S.projectId,keyId:{oneOf:[{type:"string"},{type:"integer"}]}},["projectId","keyId"]),
 tool("lokalise.key.create","Create project keys.","WRITE",z.object({projectId,keys:z.array(z.record(z.unknown())).min(1).max(100),approved}).strict(),{projectId:S.projectId,keys:{type:"array",items:{type:"object"},minItems:1,maxItems:100},approved:S.approved},["projectId","keys"]),
 tool("lokalise.key.update","Update a project key.","WRITE",z.object({projectId,keyId:id,key:z.record(z.unknown()),approved}).strict(),{projectId:S.projectId,keyId:{oneOf:[{type:"string"},{type:"integer"}]},key:{type:"object"},approved:S.approved},["projectId","keyId","key"]),
 tool("lokalise.translation.list","List project translations.","READ",z.object({projectId,page,limit,filterLangId:z.number().int().positive().optional(),filterUntranslated:z.boolean().optional()}).strict(),{projectId:S.projectId,page:S.page,limit:S.limit,filterLangId:{type:"integer"},filterUntranslated:{type:"boolean"}},["projectId"]),
 tool("lokalise.translation.get","Get a translation.","READ",z.object({projectId,translationId:id}).strict(),{projectId:S.projectId,translationId:{oneOf:[{type:"string"},{type:"integer"}]}},["projectId","translationId"]),
 tool("lokalise.translation.update","Update translation text and optional review flags.","WRITE",z.object({projectId,translationId:id,translation:z.string().max(100000),isReviewed:z.boolean().optional(),isUnverified:z.boolean().optional(),approved}).strict(),{projectId:S.projectId,translationId:{oneOf:[{type:"string"},{type:"integer"}]},translation:{type:"string"},isReviewed:{type:"boolean"},isUnverified:{type:"boolean"},approved:S.approved},["projectId","translationId","translation"]),
 tool("lokalise.comment.list","List project comments.","READ",z.object({projectId,page,limit}).strict(),{projectId:S.projectId,page:S.page,limit:S.limit},["projectId"]),
 tool("lokalise.comment.create","Create a project-level comment.","WRITE",z.object({projectId,comment:z.string().min(1).max(10000),approved}).strict(),{projectId:S.projectId,comment:{type:"string"},approved:S.approved},["projectId","comment"]),
 tool("lokalise.task.list","List project translation tasks.","READ",z.object({projectId,page,limit}).strict(),{projectId:S.projectId,page:S.page,limit:S.limit},["projectId"]),
 tool("lokalise.task.get","Get a translation task.","READ",z.object({projectId,taskId:id}).strict(),{projectId:S.projectId,taskId:{oneOf:[{type:"string"},{type:"integer"}]}},["projectId","taskId"]),
 tool("lokalise.task.create","Create a translation task using Lokalise task fields.","WRITE",z.object({projectId,task:z.record(z.unknown()),approved}).strict(),{projectId:S.projectId,task:{type:"object"},approved:S.approved},["projectId","task"])
];
export const TOOL_MAP=new Map(TOOLS.map(t=>[t.name,t]));
