import { z } from "zod";
import type { Risk } from "./policy.js";

const siteId = z.string().min(1).max(255);
const cursor = z.string().min(1).max(500).optional();
const limit = z.number().int().min(1).max(100).optional();
const pagination = { after: cursor, before: cursor, limit };
const trackerConfig = z.object({
  track_404_pages: z.boolean().optional(),
  hash_based_routing: z.boolean().optional(),
  outbound_links: z.boolean().optional(),
  file_downloads: z.boolean().optional(),
  revenue_tracking: z.boolean().optional(),
  tagged_events: z.boolean().optional(),
  form_submissions: z.boolean().optional(),
  pageview_props: z.boolean().optional()
}).strict();
const dimension = z.string().regex(/^(event:|visit:|time(?::(hour|day|week|month))?$)/).or(z.string().regex(/^event:props:[A-Za-z0-9_.-]{1,80}$/));
const metric = z.enum(["visitors","visits","pageviews","views_per_visit","bounce_rate","visit_duration","events","conversion_rate","time_on_page"]);

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
const js = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, ...(required.length ? { required } : {}) });

export const TOOLS: ToolDef[] = [
  { name:"plausible.stats.query", risk:"READ", description:"Query aggregated historical or real-time analytics with Stats API v2.", schema:z.object({siteId,metrics:z.array(metric).min(1).max(9),dateRange:z.union([z.string().min(1).max(40),z.tuple([z.string(),z.string()])]),dimensions:z.array(dimension).max(5).optional(),filters:z.array(z.unknown()).max(20).optional(),include:z.record(z.boolean()).optional(),pagination:z.object({limit:z.number().int().min(1).max(10000).optional(),offset:z.number().int().min(0).optional()}).strict().optional()}).strict(), inputSchema:js({siteId:{type:"string"},metrics:{type:"array",minItems:1,maxItems:9,items:{type:"string"}},dateRange:{},dimensions:{type:"array",maxItems:5,items:{type:"string"}},filters:{type:"array",maxItems:20},include:{type:"object"},pagination:{type:"object"}},["siteId","metrics","dateRange"])},
  { name:"plausible.site.list", risk:"READ", description:"List sites available to the Sites API key using cursor pagination.", schema:z.object({...pagination,teamId:z.string().uuid().optional()}).strict(), inputSchema:js({after:{type:"string"},before:{type:"string"},limit:{type:"integer",minimum:1,maximum:100},teamId:{type:"string"}})},
  { name:"plausible.team.list", risk:"READ", description:"List teams and whether Sites API is available.", schema:z.object(pagination).strict(), inputSchema:js({after:{type:"string"},before:{type:"string"},limit:{type:"integer",minimum:1,maximum:100}})},
  { name:"plausible.site.get", risk:"READ", description:"Get site metadata and tracker configuration.", schema:z.object({siteId}).strict(), inputSchema:js({siteId:{type:"string"}},["siteId"])},
  { name:"plausible.goal.list", risk:"READ", description:"List configured goals for a site.", schema:z.object({siteId}).strict(), inputSchema:js({siteId:{type:"string"}},["siteId"])},
  { name:"plausible.custom_property.list", risk:"READ", description:"List configured custom properties for a site.", schema:z.object({siteId}).strict(), inputSchema:js({siteId:{type:"string"}},["siteId"])},
  { name:"plausible.guest.list", risk:"READ", description:"List guests and invitations for a site.", schema:z.object({siteId,...pagination}).strict(), inputSchema:js({siteId:{type:"string"},after:{type:"string"},before:{type:"string"},limit:{type:"integer",minimum:1,maximum:100}},["siteId"])},
  { name:"plausible.site.create", risk:"WRITE", description:"Create a new Plausible site through the Enterprise Sites API.", schema:z.object({domain:siteId,timezone:z.string().min(1).max(80),trackerScriptConfiguration:trackerConfig.optional()}).strict(), inputSchema:js({domain:{type:"string"},timezone:{type:"string"},trackerScriptConfiguration:{type:"object"}},["domain","timezone"])},
  { name:"plausible.site.update", risk:"WRITE", description:"Update a site's domain and/or tracker script configuration.", schema:z.object({siteId,domain:siteId.optional(),trackerScriptConfiguration:trackerConfig.optional()}).strict().refine(v=>v.domain!==undefined||v.trackerScriptConfiguration!==undefined,"At least one update is required."), inputSchema:js({siteId:{type:"string"},domain:{type:"string"},trackerScriptConfiguration:{type:"object"}},["siteId"])},
  { name:"plausible.goal.ensure", risk:"WRITE", description:"Idempotently find or create an event or page goal.", schema:z.object({siteId,goalType:z.enum(["event","page"]),eventName:z.string().min(1).max(120).optional(),pagePath:z.string().min(1).max(2000).optional(),displayName:z.string().min(1).max(120).optional(),customProps:z.record(z.string()).optional()}).strict().superRefine((v,c)=>{if(v.goalType==="event"&&!v.eventName)c.addIssue({code:z.ZodIssueCode.custom,message:"eventName required"});if(v.goalType==="page"&&!v.pagePath)c.addIssue({code:z.ZodIssueCode.custom,message:"pagePath required"});}), inputSchema:js({siteId:{type:"string"},goalType:{enum:["event","page"]},eventName:{type:"string"},pagePath:{type:"string"},displayName:{type:"string"},customProps:{type:"object"}},["siteId","goalType"])},
  { name:"plausible.custom_property.ensure", risk:"WRITE", description:"Idempotently create a custom property.", schema:z.object({siteId,property:z.string().min(1).max(80)}).strict(), inputSchema:js({siteId:{type:"string"},property:{type:"string"}},["siteId","property"])},
  { name:"plausible.guest.invite", risk:"HIGH_RISK", description:"Invite a viewer or editor to a site; sends an external invitation.", schema:z.object({siteId,email:z.string().email(),role:z.enum(["viewer","editor"])}).strict(), inputSchema:js({siteId:{type:"string"},email:{type:"string",format:"email"},role:{enum:["viewer","editor"]}},["siteId","email","role"])},
  { name:"plausible.event.track", risk:"HIGH_RISK", description:"Record one pageview or custom event; modifies analytics data and is restricted to configured site domains.", schema:z.object({domain:siteId,name:z.string().min(1).max(120),url:z.string().url().max(4096),userAgent:z.string().min(1).max(1000),forwardedFor:z.string().max(500).optional(),referrer:z.string().url().max(4096).optional(),props:z.record(z.union([z.string(),z.number(),z.boolean()])).refine(v=>Object.keys(v).length<=30,"At most 30 props").optional(),revenue:z.object({currency:z.string().regex(/^[A-Z]{3}$/),amount:z.union([z.number().nonnegative(),z.string().regex(/^\d+(\.\d+)?$/)])}).strict().optional(),interactive:z.boolean().optional()}).strict(), inputSchema:js({domain:{type:"string"},name:{type:"string"},url:{type:"string",format:"uri"},userAgent:{type:"string"},forwardedFor:{type:"string"},referrer:{type:"string",format:"uri"},props:{type:"object"},revenue:{type:"object"},interactive:{type:"boolean"}},["domain","name","url","userAgent"])},
  { name:"plausible.site.delete", risk:"DESTRUCTIVE", description:"Permanently delete a site with all data and configuration.", schema:z.object({siteId}).strict(), inputSchema:js({siteId:{type:"string"}},["siteId"])},
  { name:"plausible.goal.delete", risk:"DESTRUCTIVE", description:"Delete a goal from a site.", schema:z.object({siteId,goalId:z.string().min(1).max(100)}).strict(), inputSchema:js({siteId:{type:"string"},goalId:{type:"string"}},["siteId","goalId"])},
  { name:"plausible.custom_property.delete", risk:"DESTRUCTIVE", description:"Delete a custom property from a site.", schema:z.object({siteId,property:z.string().min(1).max(80)}).strict(), inputSchema:js({siteId:{type:"string"},property:{type:"string"}},["siteId","property"])},
  { name:"plausible.guest.remove", risk:"DESTRUCTIVE", description:"Remove a guest membership or invitation from a site.", schema:z.object({siteId,email:z.string().email()}).strict(), inputSchema:js({siteId:{type:"string"},email:{type:"string",format:"email"}},["siteId","email"])}
];

export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
