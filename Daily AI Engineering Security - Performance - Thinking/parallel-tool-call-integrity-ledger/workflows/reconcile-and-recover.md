# Workflow: Reconcile and Recover
## Trigger
Parallel batch completion, approval resume, or missing/duplicate signal.
## Goal
Restore evidence-complete state without duplicate side effects.
## Inputs
Provider response, dispatcher log, approval state, effect classes.
## Baseline
Measure missing, duplicate, orphan and rework rates.
## Stages
1. Observe declared calls.
2. Build ledger.
3. Reconcile.
4. Complete -> verify and advance.
5. Wait -> bounded wait for approval/completion.
6. Block -> classify violation.
7. Retry once only for proven read-only/idempotent absence.
8. Reconcile again and stop.
## Checkpoints
After declaration, dispatch, approval resume, before next model turn.
## Metrics
Violation rate, recovery success, duplicate side effects, rework.
## Retry policy
One execution retry, two reconciliation passes.
## Stop conditions
Ambiguous mutation, identity drift, duplicate terminal, exhausted retries.
## Failure path
Freeze batch and escalate mutation ambiguity.
## Verification
Independent verifier confirms lifecycle completeness.
## Definition of Done
All calls accounted for, tests pass, no unsafe replay, metrics captured.
