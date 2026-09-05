# Workflow: Measure, Diagnose, Optimize

## Trigger
Cache-cost or latency anomaly in an agent workflow.

## Goal
Reduce avoidable cache churn with measured evidence.

## Inputs
Representative task, normalized call telemetry, provider cache semantics, thresholds.

## Baseline
Run or capture the task without proposed changes and store profiler report plus task outcome.

## Context
Include all correctness/security-critical prompt material in both baseline and candidate.

## Stages
1. Observe anomaly.
2. Measure baseline.
3. Diagnose reset events and inter-call gaps.
4. Form one hypothesis.
5. Implement one narrow improvement.
6. Measure same workload again.
7. If not improved, revert and try one alternative hypothesis.
8. If improved, run task-quality regression checks.
9. Independent reviewer verifies.

## Responsible agent
Performance Investigator for stages 1-8; Cache Benchmark Reviewer for 9.

## Tools
Trace capture, profiler, provider docs, workload tests.

## Outputs
Baseline/candidate reports, attribution, config diff, verification verdict.

## Checkpoints
No optimization before baseline. No acceptance without task-quality evidence.

## Metrics
Cache reads/writes, redundant-write ratio, reset count, TTFT/latency/cost when available, task success.

## Retry policy
Maximum two optimization hypotheses.

## Stop conditions
Two unsuccessful hypotheses, incomplete telemetry after one recapture, quality/security regression.

## Failure path
Restore baseline configuration and retain evidence for escalation.

## Verification
Reviewer reproduces profiler reports and confirms workload equivalence.

## Definition of Done
Measured improvement, regressions within threshold, review PASS, no required context lost.