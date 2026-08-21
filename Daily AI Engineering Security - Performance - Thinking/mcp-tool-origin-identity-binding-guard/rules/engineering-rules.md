# Engineering Rules

## MUST
- MUST assign every configured MCP server instance a host-controlled immutable `server_instance_id`.
- MUST derive authorization identity from trusted host configuration plus live connection generation, exact tool name, and schema digest.
- MUST keep display aliases separate from canonical authorization identities.
- MUST reject alias resolution that produces zero or more than one live candidate.
- MUST bind approval, policy, dispatch, caching, and audit records to the same canonical tool ID.
- MUST invalidate approvals when origin fingerprint, tool schema, or connection generation changes.
- MUST compare the approved identity with the live dispatcher identity immediately before execution.
- MUST treat `serverInfo.name`, tool descriptions, annotations, icons, and other server-provided presentation metadata as untrusted for identity decisions.
- MUST record canonical ID, origin fingerprint, generation, exact tool name, schema digest, and display alias in security audit events.
- MUST advance connection generation after reconnect/restart or any event that can change process/session ownership.
- MUST fail closed when registry state is stale, missing, conflicting, or ambiguous.
- MUST require independent verification before re-enabling a tool after a wrong-origin incident.

## MUST NOT
- MUST NOT authorize by tool name alone.
- MUST NOT authorize by concatenating server name and tool name without structured length-safe serialization or hashing.
- MUST NOT trust array order, connection index, UI label, model-facing normalized name, or server-reported name as a stable principal.
- MUST NOT silently pick the first tool when aliases collide.
- MUST NOT reuse an approval after schema or origin drift merely because the visible name is unchanged.
- MUST NOT fall back to fuzzy matching when a canonical ID is absent.
- MUST NOT let a model resolve security ambiguity by guessing which server/tool was intended.
- MUST NOT auto-repair an incident by deleting evidence or mutating external systems.

## SHOULD
- SHOULD display the configured origin and exact tool arguments on sensitive approval prompts.
- SHOULD run catalog auditing at startup and after every tool-list refresh.
- SHOULD preserve a short generation history for incident reconstruction.
- SHOULD use canonical JSON serialization for schema hashing.
- SHOULD expose collision counters and stale-generation denials as observability metrics.
- SHOULD use host aliases that contain an operator-recognizable instance label while keeping the canonical ID opaque.
- SHOULD make reconnect and tool-list refresh atomic from the resolver's perspective.
- SHOULD test case folding, separator ambiguity, duplicate server labels, duplicate tool names across servers, schema drift, and stale generations.

## Observable invariants
1. `alias -> canonical_id` resolves to exactly one live entry.
2. `approval.canonical_id == dispatch.canonical_id`.
3. `approval.origin_fingerprint == live.origin_fingerprint`.
4. `approval.generation == live.generation` when approval policy binds generation.
5. `registry.schema_digest == digest(registry.input_schema)`.
6. A schema/origin change cannot preserve both canonical ID and generation.
7. No policy entry is keyed solely by a display string.