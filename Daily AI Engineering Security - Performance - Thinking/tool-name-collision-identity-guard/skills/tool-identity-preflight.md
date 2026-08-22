# Skill — Tool Identity Preflight

## Purpose
Build and verify a collision-free tool identity map before tools reach the model or dispatch layer.

## Trigger
Agent startup, MCP connect/reconnect, `tools/list_changed`, deferred-tool load, handoff registration, or tool configuration change.

## Inputs
Effective tool definitions with server instance id, namespace, public name, callable id, and approval key.

## Preconditions
The complete effective tool set for the pending request is available. Dynamic sources have completed discovery for the current generation.

## Required context
Current policy and previous identity map, when any.

## Allowed tools
Read-only config/repository access and the deterministic validator in `scripts/validate_tool_identities.py`.

## Constraints
Do not mutate tool implementations. Do not invent identity from a non-unique display name alone.

## Procedure
1. Normalize each identity field without changing case-sensitive public names.
2. Compute canonical identity as `server_instance::namespace::public_name` with explicit empty namespace.
3. Detect duplicate canonical identities and duplicate model-visible names.
4. If public names collide, derive deterministic namespaced model-visible candidates.
5. Validate candidate length and allowed characters.
6. Verify one-to-one mappings among model-visible name, canonical identity, callable id, and approval key.
7. Compare with the previous map; classify expected additions/removals/renames.
8. Fail closed on unresolved ambiguity.

## Decision points
- If two records share canonical identity but differ in callable id: deny as identity corruption.
- If only public names collide and deterministic namespacing resolves them: allow the rewritten exposure map.
- If approval identity cannot be bound to canonical identity: deny.

## Expected output
Identity map plus `allow` or `deny`, collision evidence, and refresh generation.

## Metrics
Collision count, unresolved collision count, renamed-tool count, approval-binding coverage.

## Verification
Negative fixtures must prove ambiguous sets are blocked; stable sets must preserve the same exposed names across repeated runs.

## Failure handling
Capture the full conflicting identities without secrets, preserve the last known-good map only for already-running calls, and require a fresh preflight for new calls.

## Stop conditions
Stop successfully only when all mappings are one-to-one. Stop with failure immediately on unresolved ambiguity.
