# Skill: Replay Planning

## Purpose
Convert investigation evidence into a deterministic, bounded replay contract.

## Inputs
Investigation findings, candidate message IDs, environment, queue, idempotency evidence, approval state.

## Procedure
1. Select explicit message IDs; never specify an unbounded query such as `all`.
2. Confirm count is within `max_batch_size`.
3. Check age of each message against configuration.
4. Exclude permanent and unknown failures unless an approved exception exists.
5. Document side effects and idempotency/deduplication evidence.
6. Set `approval_required=true` for production, stale-message exceptions, batch-limit exceptions, or weak idempotency evidence.
7. Store the plan as JSON and make it immutable for execution.
8. Run `scripts/validate-replay-plan.py`.
9. Compute and retain the plan SHA-256 hash.
10. Hand off only the validated plan, never a verbal message selection.

## Expected output
A validated replay plan with exact environment, queue, message IDs, root-cause classification, idempotency evidence, reason, approval requirement, and approval reference.

## Failure handling
Any validator error blocks execution. Change the plan only by creating a new version and validating again.

## Stop conditions
Stop if approval is required but absent or if any selected message has unresolved identity, tenant, or failure classification.
