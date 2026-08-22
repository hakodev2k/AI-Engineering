# Skill — Namespace Audit

## Purpose
Audit an MCP/tool manifest before any tool definition is exposed to a model.

## Trigger
Initial server discovery, reconnect, `tools/listChanged`, configuration reload, or provider/model migration that changes tool-name constraints.

## Inputs
Server identity, raw tool name, JSON schema, optional prior alias registry, provider naming constraints.

## Preconditions
The caller can enumerate the complete active toolset and has not yet exposed newly discovered names to the model.

## Required context
Only tool metadata required to establish identity. Do not include credentials or tool outputs.

## Allowed tools
Read-only manifest inspection, hashing, deterministic name normalization, policy validation.

## Constraints
Never choose a winner by registration order. Never discard a duplicate silently. Never treat a display label as a globally unique server identity without validation.

## Procedure
1. Canonicalize server identity using a configured stable ID.
2. Preserve every raw server and tool name.
3. Compute a canonical schema digest with sorted JSON object keys.
4. Apply the configured model-facing normalization to each server/tool pair.
5. Group by raw name, normalized alias, and canonical identity.
6. Classify collisions: exact duplicate, cross-server duplicate, lossy-normalization collision, built-in collision, or schema drift.
7. Generate deterministic aliases for non-ambiguous entries.
8. Compare aliases and schema digests with the prior registry when provided.
9. Block unresolved ambiguity or unexpected drift.
10. Emit evidence containing raw identity, alias, digest, collision class, and decision.

## Decision points
- Same server + same raw name + same schema: deduplicate only if policy explicitly allows identical duplicates.
- Same alias but different canonical identity: block and require deterministic disambiguation.
- Existing alias now points to a changed schema/provider: block until registry update is approved.

## Expected output
A complete alias map or a blocking collision report. Partial maps MUST NOT be used when any high-impact ambiguity remains.

## Metrics
Stable alias percentage, collisions per refresh, blocked drift events, unresolved ambiguity count.

## Verification
Run the same manifest twice and require byte-identical alias output. Shuffle input order and require identical output.

## Failure handling
Malformed schema or missing stable server ID is a blocking validation error. Retry at most twice after refreshing discovery state.

## Stop conditions
Stop successfully when all active tools map one-to-one to stable aliases. Stop blocked when ambiguity remains after two refreshes.