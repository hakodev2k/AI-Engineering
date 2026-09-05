# Skill: Agent Latency Attribution

## Purpose
Measure where agent/tool latency occurs before changing implementation.

## Trigger
Slow runs, tool complaints, approval delay, MCP latency, regressions, unexplained stalls.

## Inputs
Trace JSONL, representative workload, approval policy, baseline environment/version.

## Preconditions
Use monotonic/synchronized timestamps. Sensitive payload capture is unnecessary.

## Required context
Approval flow, dispatch queue, worker boundary, result handling, resume point.

## Allowed tools
Tracing SDKs, OpenTelemetry, runtime logs, profiler, safe benchmarks.

## Constraints
Never bypass approval/security. Do not infer tool slowness from E2E duration with incomplete attribution.

## Procedure
1. Define workload and correctness criterion.
2. Capture baseline phases.
3. Validate ordering/coverage.
4. Compute phase p50/p95.
5. Rank dominant phases.
6. Form one falsifiable hypothesis for dominant controllable phase.
7. Implement one change.
8. Repeat identical workload.
9. Compare phase/E2E/throughput/errors/correctness.
10. Independent review.

## Decision points
Approval dominates -> optimize workflow/notification, never bypass. Execution dominates -> profile tool. Dispatch dominates -> queue/concurrency. Resume/result dominates -> orchestration/serialization.

## Expected output
Baseline, dominant phase, hypothesis, before/after metrics, regression status.

## Metrics
Phase/E2E p50/p95, coverage, throughput, errors.

## Verification
Equivalent workload and independent metric review.

## Failure handling
Missing timestamps block conclusion; repair once.

## Stop conditions
Verified improvement, two failed cycles, or security/correctness regression.