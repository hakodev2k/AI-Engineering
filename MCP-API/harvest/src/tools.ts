import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.number().int().positive();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const approvalToken = z.string().min(8).max(512);
const paginationShape = {
  perPage: z.number().int().min(1).max(2000).optional(),
  page: z.number().int().positive().optional(),
  cursor: z.string().min(1).max(2000).optional()
};
const paginated = (extra: z.ZodRawShape = {}) => z.object({ ...paginationShape, ...extra }).strict().refine(v => !(v.page && v.cursor), "page and cursor are mutually exclusive");

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
  permission: string;
  approval: "none" | "required";
};

const pageProps = { perPage:{type:"integer",minimum:1,maximum:2000}, page:{type:"integer",minimum:1}, cursor:{type:"string",minLength:1,maxLength:2000} };
const defs: ToolDef[] = [
  { name:"harvest.user.me", description:"Get the authenticated Harvest user.", risk:"READ", permission:"Harvest account access", approval:"none", schema:z.object({}).strict(), inputSchema:{type:"object",properties:{},additionalProperties:false} },
  { name:"harvest.user.list", description:"List users visible to the authenticated principal.", risk:"READ", permission:"Harvest user read access", approval:"none", schema:paginated(), inputSchema:{type:"object",properties:pageProps,additionalProperties:false} },
  { name:"harvest.client.list", description:"List clients with optional active-state filter.", risk:"READ", permission:"Client read access", approval:"none", schema:paginated({isActive:z.boolean().optional()}), inputSchema:{type:"object",properties:{...pageProps,isActive:{type:"boolean"}},additionalProperties:false} },
  { name:"harvest.client.get", description:"Get one client by ID.", risk:"READ", permission:"Client read access", approval:"none", schema:z.object({clientId:id}).strict(), inputSchema:{type:"object",properties:{clientId:{type:"integer",minimum:1}},required:["clientId"],additionalProperties:false} },
  { name:"harvest.project.list", description:"List projects with optional client or active-state filters.", risk:"READ", permission:"Project read access", approval:"none", schema:paginated({clientId:id.optional(),isActive:z.boolean().optional()}), inputSchema:{type:"object",properties:{...pageProps,clientId:{type:"integer",minimum:1},isActive:{type:"boolean"}},additionalProperties:false} },
  { name:"harvest.project.get", description:"Get one project by ID.", risk:"READ", permission:"Project read access", approval:"none", schema:z.object({projectId:id}).strict(), inputSchema:{type:"object",properties:{projectId:{type:"integer",minimum:1}},required:["projectId"],additionalProperties:false} },
  { name:"harvest.task.list", description:"List Harvest tasks.", risk:"READ", permission:"Task read access", approval:"none", schema:paginated({isActive:z.boolean().optional()}), inputSchema:{type:"object",properties:{...pageProps,isActive:{type:"boolean"}},additionalProperties:false} },
  { name:"harvest.time_entry.list", description:"List time entries with bounded filters.", risk:"READ", permission:"Timesheet read access", approval:"none", schema:paginated({userId:id.optional(),projectId:id.optional(),from:date.optional(),to:date.optional()}), inputSchema:{type:"object",properties:{...pageProps,userId:{type:"integer",minimum:1},projectId:{type:"integer",minimum:1},from:{type:"string",pattern:"^\\d{4}-\\d{2}-\\d{2}$"},to:{type:"string",pattern:"^\\d{4}-\\d{2}-\\d{2}$"}},additionalProperties:false} },
  { name:"harvest.time_entry.get", description:"Get one time entry by ID.", risk:"READ", permission:"Timesheet read access", approval:"none", schema:z.object({timeEntryId:id}).strict(), inputSchema:{type:"object",properties:{timeEntryId:{type:"integer",minimum:1}},required:["timeEntryId"],additionalProperties:false} },
  { name:"harvest.time_entry.create", description:"Create a duration-based time entry after explicit approval.", risk:"WRITE", permission:"Timesheet write access", approval:"required", schema:z.object({projectId:id,taskId:id,spentDate:date,hours:z.number().positive().max(24),notes:z.string().max(5000).optional(),userId:id.optional(),approvalToken}).strict(), inputSchema:{type:"object",properties:{projectId:{type:"integer",minimum:1},taskId:{type:"integer",minimum:1},spentDate:{type:"string"},hours:{type:"number",exclusiveMinimum:0,maximum:24},notes:{type:"string",maxLength:5000},userId:{type:"integer",minimum:1},approvalToken:{type:"string",minLength:8,maxLength:512}},required:["projectId","taskId","spentDate","hours","approvalToken"],additionalProperties:false} },
  { name:"harvest.time_entry.update", description:"Update mutable fields on a time entry after explicit approval.", risk:"WRITE", permission:"Timesheet write access", approval:"required", schema:z.object({timeEntryId:id,hours:z.number().positive().max(24).optional(),notes:z.string().max(5000).optional(),spentDate:date.optional(),approvalToken}).strict().refine(v => v.hours !== undefined || v.notes !== undefined || v.spentDate !== undefined,"At least one mutable field is required."), inputSchema:{type:"object",properties:{timeEntryId:{type:"integer",minimum:1},hours:{type:"number",exclusiveMinimum:0,maximum:24},notes:{type:"string",maxLength:5000},spentDate:{type:"string"},approvalToken:{type:"string",minLength:8,maxLength:512}},required:["timeEntryId","approvalToken"],additionalProperties:false} },
  { name:"harvest.time_entry.stop", description:"Stop a running timer after explicit approval.", risk:"WRITE", permission:"Timesheet write access", approval:"required", schema:z.object({timeEntryId:id,approvalToken}).strict(), inputSchema:{type:"object",properties:{timeEntryId:{type:"integer",minimum:1},approvalToken:{type:"string",minLength:8,maxLength:512}},required:["timeEntryId","approvalToken"],additionalProperties:false} },
  { name:"harvest.time_entry.restart", description:"Restart a stopped timer after explicit approval.", risk:"WRITE", permission:"Timesheet write access", approval:"required", schema:z.object({timeEntryId:id,approvalToken}).strict(), inputSchema:{type:"object",properties:{timeEntryId:{type:"integer",minimum:1},approvalToken:{type:"string",minLength:8,maxLength:512}},required:["timeEntryId","approvalToken"],additionalProperties:false} },
  { name:"harvest.expense.list", description:"List expenses with optional user/project/date filters.", risk:"READ", permission:"Expense read access", approval:"none", schema:paginated({userId:id.optional(),projectId:id.optional(),from:date.optional(),to:date.optional()}), inputSchema:{type:"object",properties:{...pageProps,userId:{type:"integer",minimum:1},projectId:{type:"integer",minimum:1},from:{type:"string"},to:{type:"string"}},additionalProperties:false} },
  { name:"harvest.invoice.list", description:"List invoices visible to an administrator or permitted manager.", risk:"READ", permission:"Invoice read access", approval:"none", schema:paginated({clientId:id.optional()}), inputSchema:{type:"object",properties:{...pageProps,clientId:{type:"integer",minimum:1}},additionalProperties:false} },
  { name:"harvest.report.project_time", description:"Retrieve project time report for a date range of at most 365 days.", risk:"READ", permission:"Reports read access", approval:"none", schema:z.object({from:date,to:date,perPage:z.number().int().min(1).max(2000).optional(),page:z.number().int().positive().optional()}).strict().refine(v => { const a=Date.parse(v.from+"T00:00:00Z"), b=Date.parse(v.to+"T00:00:00Z"); return Number.isFinite(a) && Number.isFinite(b) && b>=a && (b-a)<=365*86400000; },"Report range must be valid and at most 365 days."), inputSchema:{type:"object",properties:{from:{type:"string"},to:{type:"string"},perPage:{type:"integer",minimum:1,maximum:2000},page:{type:"integer",minimum:1}},required:["from","to"],additionalProperties:false} }
];

export const TOOLS = defs;
export const TOOL_MAP = new Map(defs.map(tool => [tool.name, tool]));
