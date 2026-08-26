# Workflow — Failure Recovery

## Trigger
Review cycle budget exhausted, repeated no-progress cycle, or a finding requires scope outside the approved requirements.

## Goal
Reach a truthful terminal state without suppressing risk or silently expanding the task.

## Inputs
Review state, classified findings, progress history, failed tests, requirement ledger.

## Baseline
Capture last verified production state and last cycle that produced measurable progress.

## Stages
1. Detect the stop reason using `scripts/review_scope_gate.py`.
2. Freeze active implementation; do not start new scope.
3. Separate unresolved in-scope blockers from deferred out-of-scope risks.
4. Preserve minimal evidence: reproduction, failing test, diff pointer and requirement mapping.
5. Choose fallback: revert the bounded change, retain last verified state, or disable the affected feature when safe.
6. Escalate owner-required decisions explicitly.

## Responsible agent
Coordinator; independent reviewer validates the failure classification.

## Retry policy
No more automatic retries after the configured cycle budget. One recovery validation pass is allowed.

## Stop conditions
Recovery state is verified, or an irreversible/dangerous action would be required.

## Failure path
Report `blocked` with exact evidence and required owner decision. Never convert a deferred finding into hidden implementation work.

## Verification
Independent reviewer confirms last known good state and classification of all unresolved findings.

## Definition of Done
No autonomous loop remains; last verified state is known; evidence is preserved; owner decisions are explicit.
