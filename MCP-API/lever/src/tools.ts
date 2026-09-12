import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import type { LeverClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

type ToolSpec = { name: string; description: string; risk: Risk; method: "GET"|"POST"|"PUT"; path: (a: any) => string; query?: (a: any) => Record<string, unknown>; body?: (a: any) => unknown; confidential?: boolean };
const id = z.string().min(1).max(200);
const list = { limit: z.number().int().min(1).max(100).optional(), offset: z.string().max(500).optional() };

export const SPECS: ToolSpec[] = [
  { name:"lever.opportunity.list", description:"List/search candidate opportunities.", risk:"READ", method:"GET", path:()=>"/opportunities", query:a=>a, confidential:true },
  { name:"lever.opportunity.read", description:"Read one opportunity.", risk:"READ", method:"GET", path:a=>`/opportunities/${encodeURIComponent(a.id)}`, confidential:true },
  { name:"lever.opportunity.create", description:"Create an opportunity/candidate record.", risk:"HIGH_RISK", method:"POST", path:()=>"/opportunities", body:a=>a.body, confidential:true },
  { name:"lever.opportunity.stage.update", description:"Move an opportunity to another stage.", risk:"WRITE", method:"PUT", path:a=>`/opportunities/${encodeURIComponent(a.id)}/stage`, body:a=>({stage:a.stage}) },
  { name:"lever.posting.list", description:"List job postings.", risk:"READ", method:"GET", path:()=>"/postings", query:a=>a },
  { name:"lever.posting.read", description:"Read a job posting.", risk:"READ", method:"GET", path:a=>`/postings/${encodeURIComponent(a.id)}` },
  { name:"lever.user.list", description:"List Lever users.", risk:"READ", method:"GET", path:()=>"/users", query:a=>a },
  { name:"lever.user.read", description:"Read a Lever user.", risk:"READ", method:"GET", path:a=>`/users/${encodeURIComponent(a.id)}` },
  { name:"lever.stage.list", description:"List pipeline stages.", risk:"READ", method:"GET", path:()=>"/stages", query:a=>a },
  { name:"lever.stage.read", description:"Read a pipeline stage.", risk:"READ", method:"GET", path:a=>`/stages/${encodeURIComponent(a.id)}` },
  { name:"lever.source.list", description:"List candidate sources.", risk:"READ", method:"GET", path:()=>"/sources", query:a=>a },
  { name:"lever.application.list", description:"List applications for an opportunity.", risk:"READ", method:"GET", path:a=>`/opportunities/${encodeURIComponent(a.id)}/applications`, query:a=>({limit:a.limit,offset:a.offset}), confidential:true },
  { name:"lever.note.list", description:"List notes on an opportunity.", risk:"READ", method:"GET", path:a=>`/opportunities/${encodeURIComponent(a.id)}/notes`, query:a=>({limit:a.limit,offset:a.offset}), confidential:true },
  { name:"lever.note.create", description:"Add a note to an opportunity.", risk:"HIGH_RISK", method:"POST", path:a=>`/opportunities/${encodeURIComponent(a.id)}/notes`, body:a=>({value:a.value,notifyFollowers:a.notifyFollowers ?? false}), confidential:true }
];

function schemaFor(name:string): Record<string, z.ZodTypeAny> {
  if (name.endsWith(".list") && !name.includes("application") && !name.includes("note")) return list;
  if (name === "lever.opportunity.stage.update") return { id, stage:id, approval:z.enum(["approved","approved-high-risk"]) };
  if (name === "lever.opportunity.create") return { body:z.record(z.unknown()), approval:z.literal("approved-high-risk") };
  if (name === "lever.note.create") return { id, value:z.string().min(1).max(10000), notifyFollowers:z.boolean().optional(), approval:z.literal("approved-high-risk") };
  if (name === "lever.application.list" || name === "lever.note.list") return { id, ...list };
  return { id };
}

export async function execute(spec: ToolSpec, args: any, client: LeverClient, config: Config): Promise<unknown> {
  requireApproval(spec.risk, args.approval, config);
  if (spec.confidential && !config.allowConfidential) throw new Error("This tool may expose candidate/confidential data; set LEVER_ALLOW_CONFIDENTIAL=true after authorization");
  const query = spec.query?.(args);
  const body = spec.body?.(args);
  return client.request(spec.method, spec.path(args), query, body, spec.method === "GET");
}

export function registerTools(server: McpServer, client: LeverClient, config: Config): void {
  for (const spec of SPECS) server.tool(spec.name, spec.description, schemaFor(spec.name), async (args:any) => {
    const result = await execute(spec,args,client,config);
    return { content:[{type:"text",text:JSON.stringify({provider:"Lever",tool:spec.name,risk:spec.risk,untrusted_provider_content:true,result},null,2)}] };
  });
}
