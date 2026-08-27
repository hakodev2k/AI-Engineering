# Skill: Agent Progress Diagnosis

## Purpose
Diagnose autonomous-agent loops using observable state rather than hidden reasoning.

## Trigger
Repeated tool/model calls, repeated verification, rising token cost without artifacts changing, background follow-ups after apparent completion, or a circuit-open event.

## Inputs
JSONL event trace, token usage, task acceptance criteria, changed-artifact hashes, verification receipt IDs, action/target/result records.

## Preconditions
The runner can emit one event per autonomous step and can distinguish measurable progress from status text.

## Required context
Task goal, latest accepted artifact state, latest verification identity, and policy thresholds only.

## Allowed tools
Read-only log inspection, repository status/hash commands, deterministic `scripts/progress_guard.py`, test runner.

## Constraints
- MUST NOT infer progress from phrases such as “continuing” or “working”.
- MUST NOT request hidden chain-of-thought.
- MUST NOT reset the circuit automatically after a hard stop.
- MUST preserve evidence before recovery.

## Procedure
1. Establish the last known-good artifact and verification receipt.
2. Normalize each autonomous turn to action, target, result, progress, tokens, and receipt.
3. Run the progress guard against the full current-task trace.
4. Inspect repeated fingerprints and consecutive `progress=false` spans.
5. Confirm whether verification receipts advance when workspace/input state changes.
6. Classify the failure as repeated action, no-progress continuation, stale verification, token-budget breach, or step-budget breach.
7. Form one explicit, testable recovery hypothesis.
8. Apply the smallest recovery change and rerun at most twice.
9. Require independent verification before re-enabling autonomous continuation.

## Decision points
Open the circuit when any configured hard threshold is reached. If evidence cannot determine progress, fail closed and request a new human-authorized run boundary.

## Expected output
Facts, Evidence, Failure class, Root cause, Recovery action, Metrics, Verification status.

## Metrics
Steps/task, tokens/task, no-progress span, repeated fingerprint count, repeated verification receipt count, false-positive stop rate.

## Verification
A separate reviewer validates the trace, thresholds, recovery change, and fresh verification receipt.

## Failure handling
Detection: non-zero guard exit or missing event fields. Evidence: preserve trace and policy. Retry policy: maximum 2 recovery attempts. Fallback: terminate autonomous continuation and resume manually from a new run. Escalation: repeated recurrence after two fixes. Stop condition: exhausted retries or uncertain state integrity.
