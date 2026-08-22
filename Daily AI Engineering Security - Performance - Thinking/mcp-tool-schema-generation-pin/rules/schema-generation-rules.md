# MCP Schema Generation Rules

- A client **MUST** bind each tool call to the exact schema generation/hash active before dispatch.
- In-flight calls **MUST NOT** switch validators after an async wait, reconnect, or `tools/list_changed` event.
- Tool metadata refresh **MUST** build a complete staging generation before publication.
- A schema compilation or validation-construction failure **MUST NOT** partially mutate the active generation.
- The active generation **MUST** change atomically.
- Call records **MUST** persist server instance, tool name, call id, generation id, and schema hash.
- `tools/list_changed` **SHOULD** trigger a refresh promptly, but new metadata **MUST NOT** affect already-dispatched calls.
- A stale known-good generation **MAY** remain active after refresh failure only when configured and logged; the failure **MUST** remain visible.
- New calls **MUST NOT** use a partially compiled generation.
- Operators **MUST NOT** suppress schema mismatch evidence by disabling validation to recover throughput.
