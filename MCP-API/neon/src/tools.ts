import { NeonClient } from "./client.js";
import { NeonOfficialMcp } from "./mcp-upstream.js";
import { assertName, assertResourceId, clampInt, requireApproval, type Risk, ValidationError } from "./security.js";

type ToolSpec = { name: string; description: string; risk: Risk; inputSchema: any; annotations: any };
const obj = (properties: any, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });
const str = (description: string) => ({ type: "string", description });
const approval = { approvalId: str("Opaque connector approval grant supplied out-of-band by the MCP host.") };

export const tools: ToolSpec[] = [
  { name:"neon.project.list", risk:"READ", description:"READ: list or search Neon projects with bounded pagination.", inputSchema:obj({ orgId:str("Optional organization ID."), search:str("Project name or ID search."), cursor:str("Pagination cursor."), limit:{type:"integer",minimum:1,maximum:400} }), annotations:{readOnlyHint:true} },
  { name:"neon.project.get", risk:"READ", description:"READ: get one Neon project by ID.", inputSchema:obj({projectId:str("Project ID.")},["projectId"]), annotations:{readOnlyHint:true} },
  { name:"neon.project.create", risk:"HIGH_RISK", description:"HIGH_RISK: create a Neon project; may create billable infrastructure.", inputSchema:obj({ name:str("Project name."), orgId:str("Optional organization ID."), regionId:str("Optional region ID."), pgVersion:{type:"integer",minimum:14,maximum:19}, ...approval },["name","approvalId"]), annotations:{readOnlyHint:false} },
  { name:"neon.branch.list", risk:"READ", description:"READ: list/search branches in a project.", inputSchema:obj({projectId:str("Project ID."), search:str("Branch name or ID search."), cursor:str("Pagination cursor.")},["projectId"]), annotations:{readOnlyHint:true} },
  { name:"neon.branch.get", risk:"READ", description:"READ: get a branch by ID.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID.")},["projectId","branchId"]), annotations:{readOnlyHint:true} },
  { name:"neon.branch.create", risk:"WRITE", description:"WRITE: create an isolated branch, optionally from a parent branch.", inputSchema:obj({projectId:str("Project ID."),name:str("Branch name."),parentId:str("Optional parent branch ID."),protected:{type:"boolean"},...approval},["projectId","name"]), annotations:{readOnlyHint:false} },
  { name:"neon.branch.delete", risk:"DESTRUCTIVE", description:"DESTRUCTIVE: delete a branch. Disabled by default and requires explicit approval.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID."),...approval},["projectId","branchId","approvalId"]), annotations:{readOnlyHint:false,destructiveHint:true} },
  { name:"neon.database.list", risk:"READ", description:"READ: list databases on a branch.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID.")},["projectId","branchId"]), annotations:{readOnlyHint:true} },
  { name:"neon.database.create", risk:"WRITE", description:"WRITE: create a database on a branch.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID."),name:str("Database name."),ownerName:str("Existing role that owns the database."),...approval},["projectId","branchId","name","ownerName"]), annotations:{readOnlyHint:false} },
  { name:"neon.role.list", risk:"READ", description:"READ: list Postgres roles on a branch.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID.")},["projectId","branchId"]), annotations:{readOnlyHint:true} },
  { name:"neon.endpoint.list", risk:"READ", description:"READ: list compute endpoints for a branch.", inputSchema:obj({projectId:str("Project ID."),branchId:str("Branch ID.")},["projectId","branchId"]), annotations:{readOnlyHint:true} },
  { name:"neon.operation.list", risk:"READ", description:"READ: list project operations with bounded pagination.", inputSchema:obj({projectId:str("Project ID."),cursor:str("Pagination cursor."),limit:{type:"integer",minimum:1,maximum:1000}},["projectId"]), annotations:{readOnlyHint:true} }
];

export class ToolRouter {
  constructor(private api = new NeonClient(), private mcp = new NeonOfficialMcp()) {}
  async execute(name: string, a: any): Promise<any> {
    const spec = tools.find(t => t.name === name); if (!spec) throw new ValidationError("Unknown Neon tool.");
    requireApproval(spec.risk, a?.approvalId);
    switch(name) {
      case "neon.project.list": {
        const q=new URLSearchParams(); q.set("limit",String(clampInt(a.limit,10,1,400))); if(a.cursor)q.set("cursor",String(a.cursor)); if(a.search)q.set("search",String(a.search)); if(a.orgId)q.set("org_id",String(a.orgId));
        const m=await this.mcp.callIfAllowed("list_projects",{limit:clampInt(a.limit,10,1,400),...(a.search?{search:a.search}:{})}); if(m.handled)return m.data;
        return this.api.get(`/projects?${q}`);
      }
      case "neon.project.get": {
        const projectId=assertResourceId(a.projectId,"projectId"); const m=await this.mcp.callIfAllowed("describe_project",{projectId}); if(m.handled)return m.data; return this.api.get(`/projects/${projectId}`);
      }
      case "neon.project.create": {
        const project:any={name:assertName(a.name,"name",64)}; if(a.regionId)project.region_id=String(a.regionId); if(a.pgVersion)project.pg_version=clampInt(a.pgVersion,17,14,19);
        const body:any={project}; if(a.orgId)body.org_id=String(a.orgId);
        return this.api.post("/projects",body);
      }
      case "neon.branch.list": {
        const projectId=assertResourceId(a.projectId,"projectId"); const q=new URLSearchParams(); if(a.search)q.set("search",String(a.search)); if(a.cursor)q.set("cursor",String(a.cursor)); return this.api.get(`/projects/${projectId}/branches?${q}`);
      }
      case "neon.branch.get": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.get(`/projects/${p}/branches/${b}`);
      }
      case "neon.branch.create": {
        const p=assertResourceId(a.projectId,"projectId"); const branch:any={name:assertName(a.name,"name",63)}; if(a.parentId)branch.parent_id=assertResourceId(a.parentId,"parentId"); if(a.protected!=null)branch.protected=Boolean(a.protected); return this.api.post(`/projects/${p}/branches`,{branch});
      }
      case "neon.branch.delete": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.delete(`/projects/${p}/branches/${b}`);
      }
      case "neon.database.list": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.get(`/projects/${p}/branches/${b}/databases`);
      }
      case "neon.database.create": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.post(`/projects/${p}/branches/${b}/databases`,{database:{name:assertName(a.name,"name",63),owner_name:assertName(a.ownerName,"ownerName",63)}});
      }
      case "neon.role.list": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.get(`/projects/${p}/branches/${b}/roles`);
      }
      case "neon.endpoint.list": {
        const p=assertResourceId(a.projectId,"projectId"),b=assertResourceId(a.branchId,"branchId"); return this.api.get(`/projects/${p}/branches/${b}/endpoints`);
      }
      case "neon.operation.list": {
        const p=assertResourceId(a.projectId,"projectId"); const q=new URLSearchParams(); q.set("limit",String(clampInt(a.limit,100,1,1000))); if(a.cursor)q.set("cursor",String(a.cursor)); return this.api.get(`/projects/${p}/operations?${q}`);
      }
      default: throw new ValidationError("Tool not implemented.");
    }
  }
}
