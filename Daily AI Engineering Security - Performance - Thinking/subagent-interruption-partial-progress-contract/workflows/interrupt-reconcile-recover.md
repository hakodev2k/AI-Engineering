# Workflow: Interrupt → Reconcile → Recover

## Trigger
Child termination without clean verified completion.

## Goal
Preserve truthful state and continue safely from partial work.

## Inputs
Child envelope/events, task contract, policy, current state.

## Baseline
Before changing recovery behavior, record how many interruption events lack cause/progress/side-effect data and how many retries repeat prior work.

## Stages
1. **Observe** — capture termination event and child ledger.
2. **Validate** — deterministic envelope validation.
3. **Reconcile** — verify tool activity, checkpoints, side effects, and current resource state.
4. **Form recovery hypothesis** — resume, verify-first, safe-retry, escalate, or stop.
5. **Recover** — continue only from verified state.
6. **Measure again** — compare duplicate actions/rework and envelope coverage to baseline.
7. **Improved?** If no, revise recovery mechanism; maximum 2 retry cycles.
8. **Independent verification** — Recovery Verifier checks final deliverable and side effects.
9. **Complete** — parent reports verified completion or explicit unresolved blocker.

## Responsible agent
Parent orchestrator coordinates; Recovery Verifier independently checks ambiguous/risky state.

## Tools
Envelope validator, event/transcript reader, state diff/status, tests, authorized read-only external checks.

## Outputs
Validated envelope, recovery decision, state reconciliation report, final verification.

## Checkpoints
Immediately on interruption; before retry; before repeating external action; before parent completion.

## Metrics
Envelope coverage, cause accuracy, duplicate tool/side-effect rate, recovered checkpoint reuse, unsupported conclusion count, rework tokens/time.

## Retry policy
Maximum 2 recovery retries. A retry requires new verified state or a changed recovery action.

## Stop conditions
Verified completion, explicit human cancellation, unsafe ambiguity, or retry budget exhausted.

## Failure path
If envelope is invalid or evidence is unavailable, mark state unknown; inspect externally observable state if safe. If still unknown, escalate instead of replaying side effects.

## Verification
Run package tests and product-specific interruption fixtures for user cancellation, watchdog, quota, and permission rejection.

## Definition of Done
Every tested interruption has a structured envelope; causes are not conflated; side effects are verified before retry; duplicate work is reduced/measured; final deliverable independently verified; no blocking unknown remains.
