# Rules — Namespace Integrity

- Every model-facing tool identifier MUST resolve to exactly one `(server_id, raw_tool_name, schema_digest)` tuple.
- Clients MUST preserve raw names separately from sanitized/model-facing aliases.
- Clients MUST detect collisions after all provider-required normalization and sanitization.
- Registration order MUST NOT determine which colliding tool remains available.
- A colliding tool MUST NOT silently replace, shadow, or suppress another active tool.
- Server IDs used for namespacing MUST be stable and MUST themselves pass collision checks after normalization.
- Existing aliases MUST NOT be rebound to a different server, raw tool, or incompatible schema without explicit registry update.
- High-impact tools SHOULD include a schema digest in audit evidence before exposure.
- Tool refresh events MUST rerun namespace validation before the refreshed set reaches the model.
- Ambiguity MUST fail closed; convenience MUST NOT override deterministic identity.
- Authentication and authorization MUST remain independent of aliasing; an alias MUST NOT expand permissions.
- Logs MUST record collision class and canonical identity, but MUST NOT record secrets or credentials.