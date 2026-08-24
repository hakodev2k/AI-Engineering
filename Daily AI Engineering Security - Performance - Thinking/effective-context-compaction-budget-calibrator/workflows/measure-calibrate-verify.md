# Workflow — Measure, Calibrate, Verify

## Trigger
New model/runtime, accounting regression, early/late compaction report, or policy change.

## Goal
Produce a calibrated trigger with adequate effective-context headroom and no quality regression.

## Inputs
Representative workload traces, token snapshots, current policy, model/runtime metadata.

## Baseline
Record tokens/task, compactions/task, overflow recoveries/task, p50/p95 latency, and task-quality pass rate.

## Context
Use `skills/calibrate-effective-context-budget.md` and enforce `rules/compaction-budget-rules.md`.

## Stages
1. Observe baseline without policy changes.
2. Measure snapshots at pre-compaction checkpoints.
3. Diagnose with `scripts/context_budget_calibrator.py`.
4. Form one falsifiable correction hypothesis.
5. Implement the smallest accounting/threshold correction.
6. Measure again on the same workload set.
7. Compare quality and policy metrics.
8. Independent verifier reproduces results.

## Responsible agent
Implementer owns stages 1–7; Context Budget Verifier owns stage 8.

## Tools
Calibrator, regression tests, runtime traces, benchmark harness.

## Outputs
Baseline, diagnosis, hypothesis, change record, after metrics, verifier verdict.

## Checkpoints
After baseline; after diagnosis; before rollout; after independent verification.

## Metrics
Accounting error ratio, headroom ratio, compactions/task, overflow recoveries/task, tokens/task, p95 latency, quality pass rate.

## Retry policy
Maximum two implementation retries after the first attempt; each retry requires new evidence and a changed hypothesis.

## Stop conditions
Success when all metrics meet policy and independent verification passes. Failure after bounded retries, ambiguous telemetry, or any critical-context/security regression.

## Failure path
Restore prior safe configuration, retain failed evidence, and escalate rather than weakening headroom or quality criteria.

## Verification
Run tests and replay representative traces; verifier reproduces calculations from raw inputs.

## Definition of Done
Implemented, Measured, and Verified are explicitly recorded with no blocking violation.
