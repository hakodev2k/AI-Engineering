# Skill: Compaction Continuity Analysis

## Purpose
Measure and preserve correctness-critical state across a context replacement while reducing token load.

## Trigger
Before and after auto-compaction, manual compaction, context-window rollover, or resume from a persisted compacted session.

## Inputs
Pre-compaction active context, context epoch, token usage/estimates, proposed checkpoint, raw operational tail, post-compaction rendered context.

## Preconditions
Active context keys are classified by lifetime and criticality. A finite token policy exists.

## Required context
Task requirements, durable application/project state, active authorization/security constraints, complete recent tool groups, and measurable token data where available.

## Allowed tools
Read-only session/event inspection, token counters, schema validation, repository/test tooling, `scripts/checkpoint_guard.py`.

## Constraints
- Critical active context MUST NOT be removed to save tokens.
- Compaction MUST occur only at complete turn/tool-group boundaries when the implementation controls the boundary.
- A new replacement history MUST receive a new epoch ID.
- Durable active context MUST be rehydrated once per new epoch even if it was unchanged on prior turns.
- Low-priority context SHOULD be retrieved on demand rather than blindly re-injected.

## Procedure
1. Capture pre-compaction token baseline and active-context map.
2. Classify keys as durable, epoch-scoped, or turn-scoped.
3. Select a complete operational boundary and bounded raw tail.
4. Build a checkpoint containing active goal, constraints, decisions, rejected/failed approaches, next action, and active-context keys.
5. Rotate the context epoch.
6. Rehydrate all durable active keys into the replacement context.
7. Apply token budgets to checkpoint, non-critical reinjection, and raw tail.
8. Run `checkpoint_guard.py` before the next model/tool step.
9. If blocked, rebuild once with the documented missing/budget reason; then fall back or escalate.
10. Independently verify continuation fidelity.

## Decision points
- `pass`: active state matches, epoch rotated, and budgets pass.
- `block`: missing/changed active state, schema/epoch mismatch, or budget violation.
- `escalate`: critical context conflicts or cannot be reconstructed safely.

## Expected output
Facts, pre/post token metrics, missing-state list, checkpoint validation result, Decision, Risks, Verification status.

## Metrics
Active-context recall, post-compaction token count, turns to next compaction, repeated-work rate, cache read/write tokens, task success/regression rate.

## Verification
Replay representative long tasks and intentionally remove one durable key; the guard must block the corrupted replacement. Compare continuation quality and token usage against baseline compaction.

## Failure handling
Do not continue from a partial replacement. Preserve the previous authoritative history when possible. Maximum rebuild attempts: policy value, default 1.

## Stop conditions
Stop on missing critical context, inconsistent active values, invalid epoch, exhausted rebuild budget, or failed independent verification.
