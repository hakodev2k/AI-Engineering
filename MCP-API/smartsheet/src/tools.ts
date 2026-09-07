import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.union([z.string().regex(/^\d{1,20}$/), z.number().int().positive()]);
const approvalToken = z.string().regex(/^[a-f0-9]{64}$/).optional();
const pageSize = z.number().int().min(1).max(100).optional();
const cursor = z.string().max(2000).optional();
const cell = z.object({
  columnId: id,
  value: z.unknown().optional(),
  formula: z.string().max(4000).optional(),
  strict: z.boolean().optional()
}).strict().refine(v => v.value !== undefined || v.formula !== undefined, "cell requires value or formula");
const rowForAdd = z.object({
  cells: z.array(cell).min(1).max(200),
  toTop: z.boolean().optional(),
  toBottom: z.boolean().optional(),
  parentId: id.optional(),
  siblingId: id.optional(),
  above: z.boolean().optional(),
  indent: z.number().int().min(0).max(20).optional(),
  outdent: z.number().int().min(0).max(20).optional()
}).strict();
const rowForUpdate = rowForAdd.extend({ id }).strict();

export type ToolDef = {
  name: string;
  upstream: string;
  description: string;
  risk: Risk;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
};

const objectSchema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  properties,
  required,
  additionalProperties: false
});
const str = (maxLength = 500) => ({ type: "string", maxLength });
const intId = { anyOf: [{ type: "string", pattern: "^[0-9]{1,20}$" }, { type: "integer", minimum: 1 }] };
const approval = { type: "string", pattern: "^[a-f0-9]{64}$", description: "Out-of-band human approval token." };

export const TOOLS: ToolDef[] = [
  {
    name: "smartsheet.asset.search", upstream: "search", risk: "READ",
    description: "Search accessible Smartsheet assets by name or content.",
    schema: z.object({ query: z.string().min(1).max(500), scopes: z.array(z.enum(["sheetNames","reportNames","sightNames","folderNames"])).max(4).optional() }).strict(),
    inputSchema: objectSchema({ query: str(), scopes: { type: "array", maxItems: 4, items: { enum: ["sheetNames","reportNames","sightNames","folderNames"] } } }, ["query"])
  },
  {
    name: "smartsheet.workspace.list", upstream: "list_workspaces", risk: "READ",
    description: "List workspaces with bounded pagination.",
    schema: z.object({ maxItems: z.number().int().min(1).max(100).optional(), lastKey: cursor }).strict(),
    inputSchema: objectSchema({ maxItems: { type:"integer", minimum:1, maximum:100 }, lastKey: str(2000) })
  },
  {
    name: "smartsheet.workspace.browse", upstream: "browse_workspace", risk: "READ",
    description: "Browse assets in a specific workspace.",
    schema: z.object({ workspaceId: id }).strict(),
    inputSchema: objectSchema({ workspaceId: intId }, ["workspaceId"])
  },
  {
    name: "smartsheet.sheet.summary.get", upstream: "get_sheet_summary", risk: "READ",
    description: "Read a sheet summary and row/column context.",
    schema: z.object({ sheetId: id }).strict(),
    inputSchema: objectSchema({ sheetId: intId }, ["sheetId"])
  },
  {
    name: "smartsheet.sheet.version.get", upstream: "get_sheet_version", risk: "READ",
    description: "Get the current sheet version for change detection.",
    schema: z.object({ sheetId: id }).strict(),
    inputSchema: objectSchema({ sheetId: intId }, ["sheetId"])
  },
  {
    name: "smartsheet.sheet.find", upstream: "find_in_sheet", risk: "READ",
    description: "Find matching cell values inside one sheet.",
    schema: z.object({ sheetId: id, query: z.string().min(1).max(500), caseSensitive: z.boolean().optional(), page: z.number().int().min(1).max(100000).optional(), pageSize: z.number().int().min(1).max(1000).optional() }).strict(),
    inputSchema: objectSchema({ sheetId:intId, query:str(), caseSensitive:{type:"boolean"}, page:{type:"integer",minimum:1}, pageSize:{type:"integer",minimum:1,maximum:1000} }, ["sheetId","query"])
  },
  {
    name: "smartsheet.sheet.columns.get", upstream: "get_columns", risk: "READ",
    description: "Get detailed column metadata for one sheet.",
    schema: z.object({ sheetId: id }).strict(),
    inputSchema: objectSchema({ sheetId:intId }, ["sheetId"])
  },
  {
    name: "smartsheet.sheet.create", upstream: "create_sheet", risk: "WRITE",
    description: "Create a blank sheet in a workspace or folder after human approval.",
    schema: z.object({ containerId:id, containerType:z.enum(["WORKSPACE","FOLDER"]), name:z.string().min(1).max(50), columns:z.array(z.object({ title:z.string().min(1).max(50), type:z.enum(["TEXT_NUMBER","DATE","DATETIME","CHECKBOX","CONTACT_LIST","MULTI_CONTACT_LIST","PICKLIST","MULTI_PICKLIST","DURATION"]), primary:z.boolean().optional(), options:z.array(z.string().max(100)).max(100).optional() }).strict()).min(1).max(200), approvalToken }).strict(),
    inputSchema: objectSchema({ containerId:intId, containerType:{enum:["WORKSPACE","FOLDER"]}, name:str(50), columns:{type:"array",minItems:1,maxItems:200,items:objectSchema({title:str(50),type:{enum:["TEXT_NUMBER","DATE","DATETIME","CHECKBOX","CONTACT_LIST","MULTI_CONTACT_LIST","PICKLIST","MULTI_PICKLIST","DURATION"]},primary:{type:"boolean"},options:{type:"array",maxItems:100,items:str(100)}},["title","type"])}, approvalToken:approval }, ["containerId","containerType","name","columns"])
  },
  {
    name: "smartsheet.row.add", upstream: "add_rows", risk: "WRITE",
    description: "Add up to 100 rows to a sheet after human approval.",
    schema: z.object({ sheetId:id, rows:z.array(rowForAdd).min(1).max(100), approvalToken }).strict(),
    inputSchema: objectSchema({ sheetId:intId, rows:{type:"array",minItems:1,maxItems:100,items:{type:"object"}}, approvalToken:approval }, ["sheetId","rows"])
  },
  {
    name: "smartsheet.row.update", upstream: "update_rows", risk: "HIGH_RISK",
    description: "Update existing rows. Smartsheet documents updates as permanent; explicit human approval is always required.",
    schema: z.object({ sheetId:id, rows:z.array(rowForUpdate).min(1).max(100), approvalToken:z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
    inputSchema: objectSchema({ sheetId:intId, rows:{type:"array",minItems:1,maxItems:100,items:{type:"object"}}, approvalToken:approval }, ["sheetId","rows","approvalToken"])
  },
  {
    name: "smartsheet.discussion.list", upstream: "list_discussions", risk: "READ",
    description: "List sheet discussions with bounded pagination.",
    schema: z.object({ sheetId:id, pageSize, page:z.number().int().min(1).max(100000).optional() }).strict(),
    inputSchema: objectSchema({ sheetId:intId, pageSize:{type:"integer",minimum:1,maximum:100}, page:{type:"integer",minimum:1} }, ["sheetId"])
  },
  {
    name: "smartsheet.comment.add", upstream: "add_comment", risk: "WRITE",
    description: "Add a collaboration comment to an existing discussion after human approval.",
    schema: z.object({ sheetId:id, discussionId:id, text:z.string().min(1).max(10000), approvalToken }).strict(),
    inputSchema: objectSchema({ sheetId:intId, discussionId:intId, text:str(10000), approvalToken:approval }, ["sheetId","discussionId","text"])
  },
  {
    name: "smartsheet.report.list", upstream: "list_reports", risk: "READ",
    description: "List accessible reports with bounded pagination.",
    schema: z.object({ maxItems:z.number().int().min(1).max(100).optional(), lastKey:cursor }).strict(),
    inputSchema: objectSchema({ maxItems:{type:"integer",minimum:1,maximum:100}, lastKey:str(2000) })
  }
];

export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
