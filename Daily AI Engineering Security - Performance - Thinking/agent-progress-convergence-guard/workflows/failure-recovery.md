# Workflow: Failure Recovery

## Trigger
Convergence guard blocks continuation or verification rejects a claimed delta.

## Goal
Reduce uncertainty without adding unbounded process.

## Inputs
Failed cycle records, blocker, evidence, remaining retry budget.

## Baseline
Freeze current scope and fan-out count.

## Stages
1. Identify the single failed acceptance criterion.
2. Collect only missing evidence needed to discriminate the top hypothesis.
3. Choose one corrective action.
4. Execute once.
5. Re-test and re-verify.
6. If still blocked, use one final retry only when new evidence changes the hypothesis.
7. Otherwise stop and escalate with partial verified state.

## Retry policy
Maximum 2 total corrective retries per blocker.

## Stop conditions
No new evidence; exhausted retries; unsafe/irreversible action; required external decision.

## Failure path
Return verified partial deliverables, blocker evidence, and explicit non-completion status.

## Definition of Done
Either verified recovery closes the blocker, or the workflow stops with bounded, evidence-backed escalation.
