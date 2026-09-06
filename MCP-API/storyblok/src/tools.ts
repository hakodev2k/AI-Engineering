import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().regex(/^\d+$/);
const empty = z.object({}).strict();
export type Tool = { name: string; risk: Risk; description: string; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
const o = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });

export const TOOLS: Tool[] = [
  { name: "storyblok.story.list", risk: "READ", description: "List or search stories in the configured space.", schema: z.object({ page:z.number().int().min(1).optional(), perPage:z.number().int().min(1).max(100).optional(), textSearch:z.string().max(300).optional(), bySlugs:z.string().max(1000).optional(), isPublished:z.boolean().optional(), withSummary:z.boolean().optional() }).strict(), inputSchema:o({ page:{type:"integer",minimum:1}, perPage:{type:"integer",minimum:1,maximum:100}, textSearch:{type:"string",maxLength:300}, bySlugs:{type:"string",maxLength:1000}, isPublished:{type:"boolean"}, withSummary:{type:"boolean"} }) },
  { name: "storyblok.story.get", risk: "READ", description: "Retrieve one story including content.", schema:z.object({storyId:id}).strict(), inputSchema:o({storyId:{type:"string",pattern:"^[0-9]+$"}},["storyId"]) },
  { name: "storyblok.story.create", risk: "WRITE", description: "Create a draft story without publishing it.", schema:z.object({name:z.string().min(1).max(255),slug:z.string().min(1).max(255),content:z.record(z.unknown()),parentId:z.number().int().nonnegative().optional(),isFolder:z.boolean().optional()}).strict(), inputSchema:o({name:{type:"string"},slug:{type:"string"},content:{type:"object"},parentId:{type:"integer",minimum:0},isFolder:{type:"boolean"}},["name","slug","content"]) },
  { name: "storyblok.story.update", risk: "WRITE", description: "Update story fields while leaving publish state unchanged.", schema:z.object({storyId:id,name:z.string().min(1).max(255).optional(),slug:z.string().min(1).max(255).optional(),content:z.record(z.unknown()).optional()}).strict().refine(v=>v.name!==undefined||v.slug!==undefined||v.content!==undefined,"At least one change is required"), inputSchema:o({storyId:{type:"string",pattern:"^[0-9]+$"},name:{type:"string"},slug:{type:"string"},content:{type:"object"}},["storyId"]) },
  { name: "storyblok.story.publish", risk: "HIGH_RISK", description: "Publish a story by updating it with publish=true.", schema:z.object({storyId:id}).strict(), inputSchema:o({storyId:{type:"string",pattern:"^[0-9]+$"}},["storyId"]) },
  { name: "storyblok.story.delete", risk: "DESTRUCTIVE", description: "Delete a story. Disabled by default.", schema:z.object({storyId:id}).strict(), inputSchema:o({storyId:{type:"string",pattern:"^[0-9]+$"}},["storyId"]) },
  { name: "storyblok.component.list", risk: "READ", description: "List/search components in the configured space.", schema:z.object({search:z.string().max(200).optional(),isRoot:z.boolean().optional(),inGroup:z.string().max(100).optional(),sortBy:z.string().max(200).optional()}).strict(), inputSchema:o({search:{type:"string"},isRoot:{type:"boolean"},inGroup:{type:"string"},sortBy:{type:"string"}}) },
  { name: "storyblok.component.get", risk: "READ", description: "Retrieve one component schema.", schema:z.object({componentId:id}).strict(), inputSchema:o({componentId:{type:"string",pattern:"^[0-9]+$"}},["componentId"]) },
  { name: "storyblok.tag.list", risk: "READ", description: "List/search tags with bounded pagination.", schema:z.object({search:z.string().max(200).optional(),allTags:z.boolean().optional(),page:z.number().int().min(1).optional(),perPage:z.number().int().min(1).max(100).optional()}).strict(), inputSchema:o({search:{type:"string"},allTags:{type:"boolean"},page:{type:"integer",minimum:1},perPage:{type:"integer",minimum:1,maximum:100}}) }
];
export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
