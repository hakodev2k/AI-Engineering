import { z } from "zod";
import type { SingleStoreClient } from "./client.js";
import { assertAllowed, type PolicyConfig, type Risk } from "./policy.js";

const id = z.string().uuid();
const approved = z.boolean().default(false);
export interface ToolDef { name:string; purpose:string; risk:Risk; approval:boolean; schema:z.AnyZodObject; run:(input:any)=>Promise<unknown>; }

export function buildTools(client: SingleStoreClient, policy: PolicyConfig): ToolDef[] {
  const read = (name:string,purpose:string,path:(x:any)=>string,schema:z.AnyZodObject=z.object({}).strict()):ToolDef => ({name,purpose,risk:"READ",approval:false,schema,run:async x=>client.request(path(x))});
  const action = (name:string,purpose:string,risk:Risk,method:string,path:(x:any)=>string):ToolDef => ({
    name,purpose,risk,approval:true,schema:z.object({workspaceId:id,approved}).strict(),run:async x=>{assertAllowed(risk,x.approved,policy);return client.request(path(x),{method},false);}
  });
  return [
    read("singlestore.region.list","List SingleStore Helios regions",()=>"/v1/regions"),
    read("singlestore.workspace_group.list","List accessible workspace groups",()=>"/v1/workspaceGroups"),
    read("singlestore.workspace_group.get","Get a workspace group",x=>`/v1/workspaceGroups/${encodeURIComponent(x.workspaceGroupId)}`,z.object({workspaceGroupId:id}).strict()),
    read("singlestore.workspace.list","List workspaces",()=>"/v1/workspaces"),
    read("singlestore.workspace.get","Get workspace metadata and status",x=>`/v1/workspaces/${encodeURIComponent(x.workspaceId)}`,z.object({workspaceId:id}).strict()),
    read("singlestore.workspace.outbound_allowlist.get","Get a workspace outbound allowlist",x=>`/v1/workspaces/${encodeURIComponent(x.workspaceId)}/outboundAllowList`,z.object({workspaceId:id}).strict()),
    action("singlestore.workspace.suspend","Suspend a workspace; service availability is affected","HIGH_RISK","POST",x=>`/v1/workspaces/${encodeURIComponent(x.workspaceId)}/suspend`),
    action("singlestore.workspace.resume","Resume a suspended workspace","WRITE","POST",x=>`/v1/workspaces/${encodeURIComponent(x.workspaceId)}/resume`),
    action("singlestore.workspace.delete","Permanently delete a workspace","DESTRUCTIVE","DELETE",x=>`/v1/workspaces/${encodeURIComponent(x.workspaceId)}`)
  ];
}
