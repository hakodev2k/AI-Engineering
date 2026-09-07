import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const page = z.number().int().min(1).max(1000).optional();
const pageSize = z.number().int().min(1).max(100).optional();
const approvalToken = z.string().min(8).max(512);
const iso = z.string().datetime({ offset: true });

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
};

function obj(properties: Record<string, unknown>, required: string[] = []) {
  return { type: "object", properties, required, additionalProperties: false };
}
const str = { type: "string" };
const num = { type: "number" };
const bool = { type: "boolean" };

export const TOOLS: ToolDef[] = [
  { name:"clockify.workspace.list", description:"List workspaces accessible to the authenticated Clockify user.", risk:"READ", schema:z.object({}).strict(), inputSchema:obj({}) },
  { name:"clockify.user.me", description:"Read the authenticated Clockify user profile.", risk:"READ", schema:z.object({}).strict(), inputSchema:obj({}) },
  { name:"clockify.project.list", description:"List projects in a workspace with bounded pagination and optional filters.", risk:"READ", schema:z.object({workspaceId:id,name:z.string().max(200).optional(),archived:z.boolean().optional(),page,pageSize}).strict(), inputSchema:obj({workspaceId:str,name:str,archived:bool,page:num,pageSize:num},["workspaceId"]) },
  { name:"clockify.project.get", description:"Get a single project by ID.", risk:"READ", schema:z.object({workspaceId:id,projectId:id}).strict(), inputSchema:obj({workspaceId:str,projectId:str},["workspaceId","projectId"]) },
  { name:"clockify.project.create", description:"Create a project after explicit human approval.", risk:"WRITE", schema:z.object({workspaceId:id,name:z.string().min(1).max(250),clientId:id.optional(),isPublic:z.boolean().optional(),billable:z.boolean().optional(),approvalToken}).strict(), inputSchema:obj({workspaceId:str,name:str,clientId:str,isPublic:bool,billable:bool,approvalToken:str},["workspaceId","name","approvalToken"]) },
  { name:"clockify.project.update", description:"Update selected project fields after explicit human approval.", risk:"WRITE", schema:z.object({workspaceId:id,projectId:id,name:z.string().min(1).max(250).optional(),clientId:id.nullable().optional(),isPublic:z.boolean().optional(),billable:z.boolean().optional(),archived:z.boolean().optional(),approvalToken}).strict(), inputSchema:obj({workspaceId:str,projectId:str,name:str,clientId:{type:["string","null"]},isPublic:bool,billable:bool,archived:bool,approvalToken:str},["workspaceId","projectId","approvalToken"]) },
  { name:"clockify.task.list", description:"List tasks for a project.", risk:"READ", schema:z.object({workspaceId:id,projectId:id,isActive:z.boolean().optional(),page,pageSize}).strict(), inputSchema:obj({workspaceId:str,projectId:str,isActive:bool,page:num,pageSize:num},["workspaceId","projectId"]) },
  { name:"clockify.client.list", description:"List workspace clients.", risk:"READ", schema:z.object({workspaceId:id,name:z.string().max(200).optional(),archived:z.boolean().optional(),page,pageSize}).strict(), inputSchema:obj({workspaceId:str,name:str,archived:bool,page:num,pageSize:num},["workspaceId"]) },
  { name:"clockify.tag.list", description:"List workspace tags.", risk:"READ", schema:z.object({workspaceId:id,name:z.string().max(200).optional(),archived:z.boolean().optional(),page,pageSize}).strict(), inputSchema:obj({workspaceId:str,name:str,archived:bool,page:num,pageSize:num},["workspaceId"]) },
  { name:"clockify.time_entry.list", description:"List time entries for a user using bounded pagination and optional date/project filters.", risk:"READ", schema:z.object({workspaceId:id,userId:id,start:iso.optional(),end:iso.optional(),projectId:id.optional(),description:z.string().max(500).optional(),page,pageSize}).strict(), inputSchema:obj({workspaceId:str,userId:str,start:str,end:str,projectId:str,description:str,page:num,pageSize:num},["workspaceId","userId"]) },
  { name:"clockify.time_entry.get", description:"Get one time entry.", risk:"READ", schema:z.object({workspaceId:id,timeEntryId:id,hydrated:z.boolean().optional()}).strict(), inputSchema:obj({workspaceId:str,timeEntryId:str,hydrated:bool},["workspaceId","timeEntryId"]) },
  { name:"clockify.time_entry.create", description:"Create a time entry for a user after explicit human approval.", risk:"WRITE", schema:z.object({workspaceId:id,userId:id,start:iso,end:iso.optional(),description:z.string().max(3000).optional(),projectId:id.optional(),taskId:id.optional(),billable:z.boolean().optional(),tagIds:z.array(id).max(50).optional(),approvalToken}).strict(), inputSchema:obj({workspaceId:str,userId:str,start:str,end:str,description:str,projectId:str,taskId:str,billable:bool,tagIds:{type:"array",items:str,maxItems:50},approvalToken:str},["workspaceId","userId","start","approvalToken"]) },
  { name:"clockify.time_entry.update", description:"Update a time entry after explicit human approval.", risk:"WRITE", schema:z.object({workspaceId:id,timeEntryId:id,start:iso,end:iso.optional(),description:z.string().max(3000).optional(),projectId:id.optional(),taskId:id.optional(),billable:z.boolean().optional(),tagIds:z.array(id).max(50).optional(),approvalToken}).strict(), inputSchema:obj({workspaceId:str,timeEntryId:str,start:str,end:str,description:str,projectId:str,taskId:str,billable:bool,tagIds:{type:"array",items:str,maxItems:50},approvalToken:str},["workspaceId","timeEntryId","start","approvalToken"]) },
  { name:"clockify.time_entry.delete", description:"Delete a time entry. Destructive and disabled by default.", risk:"DESTRUCTIVE", schema:z.object({workspaceId:id,timeEntryId:id,approvalToken}).strict(), inputSchema:obj({workspaceId:str,timeEntryId:str,approvalToken:str},["workspaceId","timeEntryId","approvalToken"]) },
  { name:"clockify.timer.stop", description:"Stop a running timer for a user at the supplied timestamp.", risk:"HIGH_RISK", schema:z.object({workspaceId:id,userId:id,end:iso,approvalToken}).strict(), inputSchema:obj({workspaceId:str,userId:str,end:str,approvalToken:str},["workspaceId","userId","end","approvalToken"]) },
  { name:"clockify.report.detailed", description:"Generate a detailed Clockify report for a bounded date interval.", risk:"READ", schema:z.object({workspaceId:id,dateRangeStart:iso,dateRangeEnd:iso,page:z.number().int().min(1).max(1000).optional(),pageSize:z.number().int().min(1).max(1000).optional(),billable:z.boolean().optional()}).strict(), inputSchema:obj({workspaceId:str,dateRangeStart:str,dateRangeEnd:str,page:num,pageSize:num,billable:bool},["workspaceId","dateRangeStart","dateRangeEnd"]) }
];

export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
