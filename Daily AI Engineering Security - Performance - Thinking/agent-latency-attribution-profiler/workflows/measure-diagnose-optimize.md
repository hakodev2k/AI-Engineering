# Workflow: Measure, Diagnose, Optimize

## Trigger
Agent/tool latency exceeds target.

## Goal
Improve measured dominant phase without weakening security/correctness.

## Inputs
Workload, traces, thresholds, environment/version.

## Baseline
Capture representative phase traces before changes.

## Stages
Observe without cause -> Measure baseline -> Validate attribution -> Diagnose dominant phase -> Form hypothesis -> Implement -> Measure identical workload -> Compare every phase/E2E/throughput/errors -> retry once with materially different hypothesis if needed -> independent review.

## Responsible agent
Performance Investigator; independent Performance Reviewer at final stage.

## Outputs
Baseline/after traces, reports, hypothesis, change, decision.

## Checkpoints
After baseline validation and each measurement.

## Metrics
Phase/E2E p50/p95, coverage, throughput, errors.

## Retry policy
Maximum 2 optimization cycles.

## Stop conditions
Verified target, two cycles exhausted, or security/correctness regression.

## Failure path
Revert unsafe/regressing change and retain baseline evidence.

## Verification
Run regression workflow and independent review.

## Definition of Done
Targeted phase and E2E improve with comparable correctness and preserved approvals.