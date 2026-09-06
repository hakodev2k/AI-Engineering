# Skill: Prepare a Safe Replay

## Purpose
Convert an investigation into a bounded, verifiable replay plan without executing production side effects.

## When to use
After the root cause has been corrected or confirmed transient and candidate messages have been exported.

## Inputs
Replay policy, message export, investigation evidence, target environment, consumer version, known side-effect boundaries.

## Preconditions
Candidate export is immutable for the planning run; failure classes are known; idempotency behavior has evidence.

## Allowed tools
`dlq_replay_gate.py`, repository tests, staging/dry-run tools, diff inspection.

## Constraints
Planning is read-only. Production replay approval is external and must be explicit.

## Procedure
1. Freeze the exact message export and record its hash in task evidence.
2. Run `plan` with the intended environment and a trusted current time.
3. Review `blocked` messages; do not override automated reasons by editing the generated plan.
4. Review `needs-review` messages individually and resolve missing evidence at source.
5. Confirm eligible message IDs and idempotency keys are unique.
6. Confirm batch size is within policy and ordering requirements are documented.
7. Run repository-native tests for the consumer fix.
8. When available, replay a representative batch in staging or a side-effect-isolated test harness.
9. Document the exact external replay command/tool, but do not execute it when approval is required.
10. Produce an approval packet containing scope, batch count, rollback/containment action, monitoring, and stop conditions.

## Expected output
A deterministic replay plan plus an execution checklist that can be handed to an approved operator.

## Verification
The plan is ready only when all messages intended for execution are `eligible` and all required approvals are present.

## Failure handling
Validation failure blocks execution. Tool/environment failures may be retried at most twice when clearly transient; preserve evidence from each attempt.

## Stop conditions
Stop when a replay would cross an unproven non-idempotent side effect, require schema/data changes, or weaken a security/business rule.
