# Workflow — Interruption Recovery

## Trigger
A required child or parent is interrupted/cancelled, a result channel fails, or the parent wants to retry delegated work after an uncertain stop.

## Goal
Recover useful work and establish commit state without rerunning already-completed effects or declaring unsupported completion.

## Inputs
Child ID, lifecycle records, artifact references, committed-effect receipts, acceptance criteria, parent status, and retry lineage.

## Baseline
Record current retry count, known child effects, available artifacts, and acceptance status before any recovery action.

## Context
Use durable lifecycle/effect evidence and task acceptance criteria. Model narration is contextual only and never authoritative.

## Stages
1. Freeze automatic retry for the affected logical child operation.
2. Query lifecycle registry and durable receipts.
3. Inspect artifacts/tests/output stores produced before interruption.
4. Classify state: not-started, running, committed-unreported, completed-unverified, failed, or unknown.
5. If committed-unreported or completed-unverified, run acceptance checks on existing work before scheduling replacement work.
6. If not-started is conclusively proven, a bounded replacement may be scheduled by the parent coordinator.
7. If commit state remains unknown, reconcile once more after bounded backoff.
8. On second inconclusive reconciliation, block retry and escalate.
9. Have Outcome Verifier independently confirm any recovered success for high-impact work.

## Responsible agent
Recovery coordinator performs lifecycle/artifact inspection. Outcome Verifier performs independent verification.

## Tools
Read-only child registry, artifact store, receipt ledger, acceptance tests, and `scripts/reconcile_outcomes.py`.

## Outputs
Recovery classification, preserved artifacts, acceptance evidence, whether retry is permitted, and final verification status.

## Checkpoints
- No replacement work before prior commit state is reconciled.
- Existing artifacts are evaluated before being discarded.
- Retry uses the original logical work identity or explicit lineage link.

## Metrics
Already-completed work recovered, unsafe retries blocked, duplicate work avoided, mean recovery latency, and unresolved interruptions.

## Retry policy
At most two reconciliation passes. Replacement child execution is allowed only after conclusive not-started/failed-without-commit evidence or an explicit operator-approved recovery strategy.

## Stop conditions
Verified existing work, conclusive need for replacement, conclusive failure, or two unresolved reconciliation passes.

## Failure path
Preserve state, mark blocked, and escalate. Never delete artifacts or weaken acceptance requirements to manufacture a clean restart.

## Verification
Exercise fixtures where interruption occurs after artifact creation, before child start, and during unknown external commit state. Confirm only the truly not-started case is eligible for immediate replacement.

## Definition of Done
Prior work is accounted for, durable artifacts are preserved, acceptance is evaluated, retry eligibility is evidence-backed, loops are bounded, and high-impact recovered outcomes are independently verified.
