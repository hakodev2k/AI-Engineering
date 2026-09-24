import { z } from "zod";
import { CalendlyClient, qs } from "./client.js";
import { requireApproval, Risk } from "./security.js";

const uri = z.string().url().startsWith("https://api.calendly.com/");
const page = { count: z.number().int().min(1).max(100).default(20), page_token: z.string().min(1).optional() };
export type ToolDef = { name:string; description:string; risk:Risk; schema:z.ZodTypeAny; run:(a:any,c:CalendlyClient)=>Promise<any> };

export const tools: ToolDef[] = [
 { name:"calendly.user.get", description:"Get the current authenticated Calendly user.", risk:"READ", schema:z.object({}).strict(), run:(_,c)=>c.get("/users/me") },
 { name:"calendly.event_type.list", description:"List event types for a user or organization.", risk:"READ", schema:z.object({ user:uri.optional(), organization:uri.optional(), active:z.boolean().optional(), ...page }).strict().refine(x=>!!x.user||!!x.organization,"user or organization required"), run:(a,c)=>c.get("/event_types"+qs(a)) },
 { name:"calendly.event_type.get", description:"Get one event type by URI.", risk:"READ", schema:z.object({ event_type_uri:uri }).strict(), run:(a,c)=>c.get(new URL(a.event_type_uri).pathname) },
 { name:"calendly.event_type.available_times", description:"Get available times for an event type in an ISO-8601 time range.", risk:"READ", schema:z.object({ event_type_uri:uri, start_time:z.string().datetime(), end_time:z.string().datetime() }).strict(), run:(a,c)=>c.get("/event_type_available_times"+qs({event_type:a.event_type_uri,start_time:a.start_time,end_time:a.end_time})) },
 { name:"calendly.scheduled_event.list", description:"List scheduled events for a user or organization.", risk:"READ", schema:z.object({ user:uri.optional(), organization:uri.optional(), status:z.enum(["active","canceled"]).optional(), min_start_time:z.string().datetime().optional(), max_start_time:z.string().datetime().optional(), ...page }).strict().refine(x=>!!x.user||!!x.organization,"user or organization required"), run:(a,c)=>c.get("/scheduled_events"+qs(a)) },
 { name:"calendly.scheduled_event.get", description:"Get one scheduled event by URI.", risk:"READ", schema:z.object({ event_uri:uri }).strict(), run:(a,c)=>c.get(new URL(a.event_uri).pathname) },
 { name:"calendly.invitee.list", description:"List invitees for a scheduled event.", risk:"READ", schema:z.object({ event_uri:uri, ...page }).strict(), run:(a,c)=>c.get(`${new URL(a.event_uri).pathname}/invitees`+qs({count:a.count,page_token:a.page_token})) },
 { name:"calendly.invitee.get", description:"Get one invitee by URI.", risk:"READ", schema:z.object({ invitee_uri:uri }).strict(), run:(a,c)=>c.get(new URL(a.invitee_uri).pathname) },
 { name:"calendly.scheduling_link.create", description:"Create a single-use scheduling link. External scheduling capability; explicit approval required.", risk:"HIGH_RISK", schema:z.object({ event_type_uri:uri, approved:z.literal(true) }).strict(), run:(a,c)=>{requireApproval("HIGH_RISK",a.approved);return c.post("/scheduling_links",{max_event_count:1,owner:a.event_type_uri,owner_type:"EventType"});} },
 { name:"calendly.scheduled_event.cancel", description:"Cancel a scheduled event. Destructive and requires explicit approval.", risk:"DESTRUCTIVE", schema:z.object({ event_uri:uri, reason:z.string().min(1).max(255).optional(), approved:z.literal(true) }).strict(), run:(a,c)=>{requireApproval("DESTRUCTIVE",a.approved);return c.post(`${new URL(a.event_uri).pathname}/cancellation`,a.reason?{reason:a.reason}:{},false);} }
];

export async function invoke(name:string, input:unknown, client=new CalendlyClient()) {
 const t=tools.find(x=>x.name===name); if(!t) throw new Error("UNKNOWN_TOOL");
 const parsed=t.schema.parse(input); return t.run(parsed,client);
}
