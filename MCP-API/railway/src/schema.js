import Ajv from "ajv";

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  removeAdditional: false,
  coerceTypes: false,
  useDefaults: false
});

export function externalSchemaFromUpstream(upstreamSchema, needsApproval) {
  const base = structuredClone(upstreamSchema || { type: "object", properties: {} });
  if (base.type !== "object") {
    throw new Error("Upstream Railway MCP tool schema is not an object schema");
  }

  base.properties = { ...(base.properties || {}) };
  if (needsApproval) {
    base.properties.approval_token = {
      type: "string",
      minLength: 64,
      maxLength: 64,
      pattern: "^[a-f0-9]{64}$",
      description: "Connector approval HMAC bound to the exact external tool and payload."
    };
    base.required = [...new Set([...(base.required || []), "approval_token"])];
  }
  base.additionalProperties = false;
  return base;
}

export function validatorFor(schema) {
  return ajv.compile(schema);
}

export function validateOrThrow(validate, args) {
  if (validate(args)) return;
  const message = (validate.errors || [])
    .map((e) => `${e.instancePath || "/"} ${e.message}`)
    .join("; ");
  throw new Error(`Invalid tool input: ${message}`);
}
