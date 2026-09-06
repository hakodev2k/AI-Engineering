# Skill: Plan Safe Replay

## Purpose
Convert investigation evidence into an exact, bounded replay contract that deterministic tooling and a human approver can evaluate.

## When to use
After DLQ investigation has identified a finite candidate message set and replay is not already blocked.

## Inputs
Investigation record, policy, selected message IDs, handler/schema/routing evidence, idempotency evidence, expected business outcome.

## Preconditions
Message IDs, environment, queue, tenant scope, and original failure evidence are known.

## Allowed tools
Repository read, plan-file editing, `scripts/replay_guard.py`, tests, diff inspection.

## Constraints
Planning does not execute broker writes. Never broaden scope to “all remaining messages” to simplify the plan.

## Procedure
1. Populate every field required by `schemas/replay-plan.schema.json`.
2. Use the smallest useful message set; split heterogeneous failure causes into separate plans.
3. Set `batch_size` no larger than both the explicit message count and policy maximum.
4. Set `execution_retry_limit` from failure semantics; use 0 for non-transient/business failures.
5. Describe expected outcome in terms that can be checked after execution.
6. Add concrete fix evidence and idempotency/deduplication evidence.
7. Mark schema and routing compatibility only after verification.
8. Run `replay_guard.py` and record the returned plan fingerprint.
9. For production, submit exactly that substantive plan for human approval. Populate `approval.approved_by`, `approved_at`, and `plan_fingerprint`; set status to `approved`.
10. Re-run the guard after approval. Any substantive plan edit invalidates the approval fingerprint and requires new approval.
11. Produce execution instructions for the host-specific replay adapter that are limited to the approved message IDs and batch size.

## Expected output
A guard-passing replay-plan JSON plus `.dlq-replay/guard.json`.

## Verification
The plan fingerprint is stable for the substantive plan, production approval matches it, and no required evidence is absent.

## Failure handling
Guard failures return to planning. A policy block is not bypassed automatically. If approval expires or the plan changes, obtain a new approval rather than altering timestamps/fingerprints.

## Stop conditions
Stop if production approval is missing, if the plan requires wildcard scope, if retry limits exceed policy, or if safety depends on changing production infrastructure/secrets/security controls.
