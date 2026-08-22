# Deferred Tool Discovery Rules

## MUST
- A terminal capability claim MUST be preceded by either evidence that no relevant deferred capability exists or a bounded discovery attempt for matched capabilities.
- A user question caused only by an apparent capability gap MUST pass the same discovery gate before being asked.
- A workaround triggered by missing permissions/tools MUST check the deferred capability registry before modifying data or taking a weaker path.
- Discovery evidence MUST record capability ID, query, outcome, and session/decision epoch.
- Newly discovered tools MUST still pass normal authorization, permission, trust, and safety checks.
- Registry lookup and discovery retries MUST be bounded to two passes unless material new evidence appears.
- Unknown discovery state MUST be represented as unknown, not converted into `unavailable`.

## MUST NOT
- MUST NOT claim `cannot`, `unavailable`, or equivalent solely because a capability is absent from the currently loaded tool list.
- MUST NOT load every deferred schema preemptively merely to avoid discovery decisions.
- MUST NOT execute a dangerous tool just because discovery found it.
- MUST NOT repeatedly issue semantically identical ToolSearch queries without new evidence.
- MUST NOT use hidden chain-of-thought as verification evidence.

## SHOULD
- SHOULD maintain a compact intent-to-capability registry separate from full tool schemas.
- SHOULD invalidate discovery evidence after a tool-catalog change, reconnection, or relevant session epoch change.
- SHOULD measure loaded-vs-deferred acquisition rates with identical task batteries.
- SHOULD keep discovery queries narrow enough to avoid loading irrelevant schema batches.
- SHOULD escalate ambiguous matches to an independent verifier rather than asking the user prematurely.