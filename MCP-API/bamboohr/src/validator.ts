export type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean | JsonSchema;
  items?: JsonSchema;
  enum?: unknown[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
};

function fail(path: string, message: string): never {
  throw new Error(`Invalid tool input at ${path}: ${message}`);
}

export function validateAgainstSchema(schema: JsonSchema, value: unknown, path = "$input"): void {
  if (schema.enum && !schema.enum.some(v => Object.is(v, value))) fail(path, "value is not in enum");
  if (!schema.type) return;

  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(path, "expected object");
    const obj = value as Record<string, unknown>;
    for (const req of schema.required ?? []) if (!(req in obj)) fail(`${path}.${req}`, "required property missing");
    const props = schema.properties ?? {};
    for (const [key, child] of Object.entries(obj)) {
      if (props[key]) validateAgainstSchema(props[key]!, child, `${path}.${key}`);
      else if (schema.additionalProperties === false) fail(`${path}.${key}`, "unknown property");
      else if (typeof schema.additionalProperties === "object") validateAgainstSchema(schema.additionalProperties, child, `${path}.${key}`);
    }
    return;
  }

  if (schema.type === "array") {
    if (!Array.isArray(value)) fail(path, "expected array");
    if (schema.minItems !== undefined && value.length < schema.minItems) fail(path, `requires at least ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) fail(path, `allows at most ${schema.maxItems} items`);
    if (schema.items) value.forEach((v, i) => validateAgainstSchema(schema.items!, v, `${path}[${i}]`));
    return;
  }

  if (schema.type === "string") {
    if (typeof value !== "string") fail(path, "expected string");
    if (schema.minLength !== undefined && value.length < schema.minLength) fail(path, "string too short");
    if (schema.maxLength !== undefined && value.length > schema.maxLength) fail(path, "string too long");
    return;
  }

  if (schema.type === "integer" || schema.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value) || (schema.type === "integer" && !Number.isInteger(value))) fail(path, `expected ${schema.type}`);
    if (schema.minimum !== undefined && value < schema.minimum) fail(path, "number below minimum");
    if (schema.maximum !== undefined && value > schema.maximum) fail(path, "number above maximum");
    return;
  }

  if (schema.type === "boolean" && typeof value !== "boolean") fail(path, "expected boolean");
}
