# Workflow: Diagnose and Recover from a Long-Horizon Failure

## Trigger
A long-running agent task fails, stalls, emits unsupported completion, exceeds the verification-span limit, or is flagged by `trajectory_guard.py`.

## Goal
Identify the earliest evidence-backed failure point and recover from the last verified checkpoint with bounded retries.

## Inputs
Trajectory JSONL, evidence ledger, acceptance criteria, current artifacts, deterministic tests, and guard output.

## Baseline
Record task success state, total steps, verified checkpoints, active assumptions, unsupported completion claims, rework time, and current test results.

## Context
Use explicit Facts, Evidence, Assumptions, Hypotheses, Decisions, Risks, and Verification status only.

## Stages
1. **Observe:** freeze the original trace and artifacts.
2. **Measure baseline:** run `trajectory_guard.py` and capture metrics.
3. **Diagnose:** inspect the first risk step and last verified checkpoint.
4. **Form hypothesis:** state the smallest falsifiable explanation for divergence.
5. **Test hypothesis:** gather independent evidence or run deterministic checks.
6. **Replan:** resolve/reject assumptions and restart from the last verified checkpoint.
7. **Implement improvement:** execute the revised plan without changing acceptance criteria.
8. **Measure again:** rerun guard and task-specific tests.
9. **Improved?** If no, retry steps 3–8 at most once more. If yes, proceed.
10. **Independent verification:** Trajectory Reviewer reproduces decisive evidence and final checks.

## Responsible agent
Planning/implementation agent handles diagnosis and recovery; Trajectory Reviewer performs final independent verification.

## Tools
`python scripts/trajectory_guard.py`, unit/integration tests, static analysis, artifact diff, read-only logs.

## Outputs
First risk step, recovery checkpoint, resolved assumption ledger, before/after metrics, final verification decision.

## Checkpoints
After baseline; after hypothesis test; before resuming from checkpoint; before completion.

## Metrics
Steps to first risk; verification coverage; unresolved assumptions; unsupported completion count; retries; rework after review; final acceptance coverage.

## Retry policy
Maximum 2 recovery attempts per diagnosed failure.

## Stop conditions
Exhausted retries, contradictory requirements, missing required evidence, repeated verifier failure, or any dangerous/irreversible action lacking explicit human approval.

## Failure path
Preserve trace, stop autonomous continuation, produce a bounded escalation packet with unresolved facts and evidence gaps.

## Verification
Independent reviewer must reproduce the decisive checks from artifacts rather than relying on the implementation agent's narrative.

## Definition of Done
Problem localized; evidence documented; assumptions resolved or explicitly accepted; bounded recovery completed; deterministic tests pass; final claims cite evidence; independent verification passes; no blocking issue remains.
