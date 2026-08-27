# Workflow: Failure Recovery

## Trigger
Watchdog returns `cancel_and_escalate`, cancellation fails, or a stale call has unknown/consequential side effects.

## Goal
Recover the agent without duplicate side effects or indefinite waiting.

## Inputs
Call lifecycle event, cancellation result, tool idempotency/side-effect metadata, logs, attempt and wall-clock budgets.

## Baseline
Record elapsed time, deadline, attempt number, last confirmed side-effect boundary, and dependency state.

## Stages
1. Stop automatic retries.
2. Attempt cancellation once if the adapter supports it.
3. Determine whether a side effect may have committed.
4. If commit state is unknown or consequential, require operator/human review rather than replay.
5. If the operation is proven read-only/idempotent and budget remains, permit only the policy-bounded retry path.
6. Restore agent progress from the last confirmed state.
7. Verify no duplicate action occurred.

## Retry policy
No recursive recovery loop. One cancellation attempt; runtime retries remain bounded by `config/policy.json`.

## Stop conditions
Unknown commit state, irreversible action risk, exhausted wall-clock budget, or cancellation uncertainty.

## Failure path
Disable the affected tool binding/session path and surface evidence for operator review.

## Verification
Performance Verifier checks recovery time and duplicate-side-effect count.

## Definition of Done
Agent is no longer wedged, retry behavior stayed within policy, and consequential state is verified or explicitly escalated.
