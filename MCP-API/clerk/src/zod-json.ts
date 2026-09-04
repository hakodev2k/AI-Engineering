import { z } from "zod";

export function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const def = (schema as any)._def;
  if (def.typeName !== z.ZodFirstPartyTypeKind.ZodObject) throw new Error("Only object schemas are supported.");
  const shape = def.shape();
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [name, field] of Object.entries(shape) as Array<[string, z.ZodTypeAny]>) {
    const json = fieldToJson(field);
    properties[name] = json.schema;
    if (!json.optional) required.push(name);
  }
  return { type: "object", additionalProperties: false, properties, required };
}

function fieldToJson(field: z.ZodTypeAny): { schema: Record<string, unknown>; optional: boolean } {
  let current: z.ZodTypeAny = field;
  let optional = false;
  let nullable = false;
  while (true) {
    const kind = (current as any)._def.typeName;
    if (kind === z.ZodFirstPartyTypeKind.ZodOptional || kind === z.ZodFirstPartyTypeKind.ZodDefault) { optional = true; current = (current as any)._def.innerType; continue; }
    if (kind === z.ZodFirstPartyTypeKind.ZodNullable) { nullable = true; current = (current as any)._def.innerType; continue; }
    break;
  }
  const d: any = (current as any)._def;
  let schema: Record<string, unknown>;
  switch (d.typeName) {
    case z.ZodFirstPartyTypeKind.ZodString: schema = { type: "string" }; break;
    case z.ZodFirstPartyTypeKind.ZodNumber: schema = { type: "number" }; break;
    case z.ZodFirstPartyTypeKind.ZodBoolean: schema = { type: "boolean" }; break;
    case z.ZodFirstPartyTypeKind.ZodLiteral: schema = { const: d.value, type: typeof d.value }; break;
    case z.ZodFirstPartyTypeKind.ZodEnum: schema = { type: "string", enum: d.values }; break;
    case z.ZodFirstPartyTypeKind.ZodRecord: schema = { type: "object", additionalProperties: true }; break;
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const nested = zodToJsonSchema(current); schema = nested; break;
    }
    default: schema = {};
  }
  if (nullable && schema.type) schema = { ...schema, type: [schema.type, "null"] };
  return { schema, optional };
}
