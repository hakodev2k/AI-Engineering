# Workflow: Classify → Break → Recover

## Trigger
Any failed tool call in an agent workflow.

## Goal
Reduce wasted calls/latency while preserving legitimate transient recovery and side-effect safety.

## Inputs
Tool event, canonical arguments, error, incident ledger, retry policy, task objective.

## Baseline
On representative failing tasks record calls/task, retries/incident, wall-clock latency, tokens/task, repeated identical failures, recovery rate, and final correctness.

## Stages
1. **Observe** failure and capture raw evidence.
2. **Measure baseline** incident history and current budget.
3. **Diagnose** using `skills/tool-failure-classification.md`.
4. **Hypothesize** whether retry, argument correction, fallback, reconciliation, or stop can change the outcome.
5. **Implement** the selected action.
6. **Measure again** after the next result.
7. If not improved, allow at most one additional remediation with a changed cause/action.
8. **Verify** final task outcome and retry efficiency independently.

## Responsible agents
Orchestrator implements; Retry Auditor verifies.

## Tools
`scripts/retry_guard.py`, incident ledger, task-specific reconciliation and tests.

## Outputs
Incident record, decision, before/after metrics, final verification status.

## Checkpoints
Before every retry; before replaying side effects; after budget exhaustion; before completion.

## Metrics
Calls/task, duplicate failed calls, retries/incident, latency, tokens, recovery rate, regression rate.

## Retry policy
Transient: max two retries by default with backoff. Deterministic identical failure: one repeated observation maximum, then circuit opens. Remediation loop: max two changed attempts.

## Stop conditions
Circuit open; retry budget exhausted; unknown side effect unreconciled; no new evidence/change after two remediation attempts; security/permission blocker.

## Failure path
Return a structured failure with incident ID, last evidence, attempted remediations, safe fallback options, and escalation requirement. Do not silently continue.

## Verification
Compare baseline versus guarded run on the same fixtures. Improvement requires fewer calls/latency/tokens with equal or better task result and no safety regression.

## Definition of Done
Failure evidence captured; classification recorded; retry budget enforced; duplicates blocked; side effects reconciled; before/after metrics collected; task outcome verified; independent auditor passes; no blocking issue remains.