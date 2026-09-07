import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().min(1).max(200).regex(/^[^/?#]+$/);
const name = z.string().min(3).max(100).regex(/^[a-zA-Z0-9_\-. ]+$/);
const description = z.string().max(1000).optional();
const limit = z.number().int().min(1).max(100).optional();
const page = z.number().int().min(1).optional();
const approvalToken = z.string().min(8).max(512);
const condition = z.object({
  type: z.enum(["app_version","browser_name","browser_version","country","custom_field","email","environment_tier","fails_gate","fails_segment","ip_address","locale","os_name","os_version","passes_gate","passes_segment","public","time","unit_id","user_id","user_agent","url","javascript","device_model","target_app","experiment_group"]),
  targetValue: z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number()), z.null()]).optional(),
  operator: z.string().max(100).optional(),
  field: z.string().max(200).nullable().optional(),
  customID: z.string().max(200).nullable().optional()
}).strict();
const rule = z.object({
  name: z.string().min(1).max(200),
  passPercentage: z.number().min(0).max(100),
  conditions: z.array(condition).max(100),
  environments: z.array(z.string().min(1).max(100)).max(20).optional(),
  returnValue: z.record(z.unknown()).optional()
}).strict();

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; inputSchema: Record<string, unknown> };
const defs: [string,string,Risk,z.ZodTypeAny][] = [
  ["statsig.gate.list","List feature gates with bounded pagination and optional lifecycle filter.","READ",z.object({limit,page,type:z.enum(["TEMPORARY","PERMANENT","STALE"]).optional()}).strict()],
  ["statsig.gate.get","Read one feature gate by ID.","READ",z.object({gateId:id}).strict()],
  ["statsig.gate.create","Create a feature gate after explicit approval.","WRITE",z.object({name,description,isEnabled:z.boolean().optional(),rules:z.array(rule).max(100).optional(),approvalToken}).strict()],
  ["statsig.gate.update","Partially update a gate after explicit approval.","WRITE",z.object({gateId:id,name:name.optional(),description,isEnabled:z.boolean().optional(),type:z.enum(["PERMANENT","TEMPORARY"]).optional(),rules:z.array(rule).max(100).optional(),approvalToken}).strict()],
  ["statsig.experiment.list","List experiments with pagination and optional status filter.","READ",z.object({limit,page,status:z.string().max(100).optional(),stale:z.boolean().optional()}).strict()],
  ["statsig.experiment.get","Read one experiment by ID.","READ",z.object({experimentId:id}).strict()],
  ["statsig.dynamic_config.list","List dynamic configs with bounded pagination.","READ",z.object({limit,page,type:z.enum(["TEMPORARY","PERMANENT","STALE"]).optional()}).strict()],
  ["statsig.dynamic_config.get","Read one dynamic config by ID.","READ",z.object({configId:id}).strict()],
  ["statsig.dynamic_config.create","Create a dynamic config after explicit approval.","WRITE",z.object({name,description,isEnabled:z.boolean().optional(),defaultValue:z.record(z.unknown()).optional(),rules:z.array(rule).max(100).optional(),approvalToken}).strict()],
  ["statsig.dynamic_config.update","Partially update a dynamic config after explicit approval.","WRITE",z.object({configId:id,name:name.optional(),description,isEnabled:z.boolean().optional(),type:z.enum(["PERMANENT","TEMPORARY"]).optional(),defaultValue:z.record(z.unknown()).optional(),rules:z.array(rule).max(100).optional(),approvalToken}).strict()],
  ["statsig.metric.list","List project metrics.","READ",z.object({limit,page,showHiddenMetrics:z.boolean().optional(),filters:z.string().max(1000).optional()}).strict()],
  ["statsig.metric_value.list","List metric values for a specific date.","READ",z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),limit,page,metricName:z.string().max(200).optional(),metricType:z.string().max(100).optional()}).strict()]
];

function inputSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const shape = (schema as any)._def.shape();
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, value] of Object.entries<any>(shape)) {
    let node = value;
    while (node?._def?.innerType) node = node._def.innerType;
    const typeName = node?._def?.typeName ?? "";
    const type = typeName.includes("Number") ? "number" : typeName.includes("Boolean") ? "boolean" : typeName.includes("Array") ? "array" : typeName.includes("Object") ? "object" : "string";
    properties[key] = { type };
    if (!value.isOptional()) required.push(key);
  }
  return { type: "object", properties, required, additionalProperties: false };
}

export const TOOLS: ToolDef[] = defs.map(([n,d,r,s]) => ({ name:n, description:d, risk:r, schema:s, inputSchema:inputSchema(s) }));
export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
