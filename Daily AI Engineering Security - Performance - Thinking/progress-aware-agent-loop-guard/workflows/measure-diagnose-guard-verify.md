# Workflow: Measure, Diagnose, Guard, Verify

## Trigger
Recurring repeated tool calls, recursion-limit failures, excessive calls/tokens/latency, or evidence of runtime replay.

## Goal
Reduce non-productive execution while preserving task success and side-effect safety.

## Inputs
Representative task set, raw traces, tool registry, side-effect classification, framework/runtime versions, current limits, quality criteria.

## Baseline
Run the representative set without the new guard. Capture calls/task, model calls/task, tokens/task, latency, completion status, and side effects.

## Context
Apply `rules/progress-termination-rules.md`. Use `skills/no-progress-diagnosis.md` for classification.

## Stages
1. **Observe — Performance Investigator.** Collect failing and successful traces without changing thresholds.
2. **Measure baseline — Performance Investigator.** Record the required metrics and hard-limit behavior.
3. **Diagnose — Performance Investigator.** Fingerprint calls/outcomes/state and classify exact streak, cycle, stagnation, or runtime replay.
4. **Form hypothesis — Performance Investigator.** State one falsifiable root-cause hypothesis and expected signature.
5. **Implement improvement — Implementation owner.** Fix root cause when feasible; install the deterministic guard as a bounded backstop.
6. **Measure again — Performance Investigator.** Re-run the identical task set/config except for the stated intervention.
7. **Decision checkpoint.** If calls/tokens/latency did not improve or task success regressed beyond policy, re-evaluate. Maximum two intervention attempts.
8. **Independent verification — Verification Agent.** Run tests and inspect raw before/after reports.

## Tools
`scripts/progress_guard.py`, unit tests, trace/log queries, framework-native telemetry, benchmark harness.

## Outputs
Baseline report, diagnosis record, guard configuration, post-change report, independent verification verdict.

## Checkpoints
- Baseline must exist before optimization.
- Side-effecting tools must be identified before enabling automatic continuation/retry.
- Verification must compare the same workload.

## Metrics
Calls/task, repeated-call count, tokens/task, latency p50/p95, task success, false-positive stops, duplicated side effects.

## Retry policy
At most two hypothesis/intervention revisions. Each retry requires new evidence explaining why the previous intervention failed.

## Stop conditions
Stop successfully when verification passes. Stop unsuccessfully after two failed intervention revisions, a safety regression, missing required evidence, or inability to reproduce the loop.

## Failure path
Restore the last known-good runtime/guard configuration, retain traces, mark the run unresolved, and escalate. Do not weaken correctness, authorization, or side-effect protections to obtain a performance win.

## Definition of Done
Baseline and post-change measurements exist; tests pass; loop fixtures stop early; task success is within tolerance; side effects are not duplicated; independent verifier returns `VERIFIED`.
