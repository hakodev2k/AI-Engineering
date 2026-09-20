import { z } from "zod";
import type { Upstream } from "./upstream.js";
import { resolveTool } from "./upstream.js";
import { requireApproval, type Risk } from "./security.js";

export type ToolDef = {name:string;description:string;risk:Risk;schema:z.ZodTypeAny;patterns:RegExp[]};
const id=z.string().min(1).max(128);
export const tools: ToolDef[] = [
 {name:"zeabur.project.list",description:"List accessible Zeabur projects",risk:"READ",schema:z.object({ownerID:id.optional()}).strict(),patterns:[/list.*project/i,/project.*list/i]},
 {name:"zeabur.project.create",description:"Create a Zeabur project",risk:"WRITE",schema:z.object({name:z.string().min(1).max(100),region:z.string().min(1).max(64).optional(),ownerID:id.optional()}).strict(),patterns:[/create.*project/i,/project.*create/i]},
 {name:"zeabur.service.list",description:"List services in a project",risk:"READ",schema:z.object({projectID:id}).strict(),patterns:[/list.*service/i,/service.*list/i]},
 {name:"zeabur.service.status",description:"Read service status",risk:"READ",schema:z.object({serviceID:id}).strict(),patterns:[/service.*(status|get)/i,/(get|status).*service/i]},
 {name:"zeabur.environment.configure",description:"Configure service environment variables",risk:"WRITE",schema:z.object({serviceID:id,environmentID:id,variables:z.record(z.string().max(8192))}).strict(),patterns:[/(env|variable).*(set|update|configure)/i,/(set|update).*(env|variable)/i]},
 {name:"zeabur.domain.bind",description:"Bind a domain to a service",risk:"WRITE",schema:z.object({serviceID:id,environmentID:id,domain:z.string().min(3).max(253).regex(/^[a-z0-9.-]+$/i)}).strict(),patterns:[/(bind|create).*domain/i,/domain.*(bind|create)/i]},
 {name:"zeabur.deployment.logs",description:"Read deployment logs",risk:"READ",schema:z.object({projectID:id,deploymentID:id}).strict(),patterns:[/(deployment|build).*log/i,/log.*(deployment|build)/i]},
 {name:"zeabur.application.deploy",description:"Deploy an application or service",risk:"HIGH_RISK",schema:z.object({projectID:id,serviceID:id.optional(),environmentID:id.optional()}).strict(),patterns:[/deploy/i]}
];

export async function invoke(def:ToolDef,args:unknown,upstream:Upstream):Promise<unknown>{
 const parsed=def.schema.parse(args); requireApproval(def.risk); const name=await resolveTool(upstream,def.patterns);
 return upstream.callTool({name,arguments:parsed});
}
