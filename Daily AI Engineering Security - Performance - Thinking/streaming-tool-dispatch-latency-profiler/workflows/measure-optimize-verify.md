# Workflow: Measure, Optimize, Verify Dispatch

## Trigger
Streaming agent latency investigation.

## Goal
Reduce avoidable dispatch wait without changing tool semantics or weakening approval/guardrail boundaries.

## Inputs
Representative workload, lifecycle traces, tool dependency map, safety policy.

## Baseline
Run the target workload unchanged and capture lifecycle timestamps for every tool call.

## Stages
1. Observe end-to-end latency and trace completeness.
2. Measure baseline dispatch wait and tool duration by tool.
3. Diagnose whether delay occurs before safety readiness, after safety readiness, or inside tool execution.
4. Form one falsifiable hypothesis.
5. Implement the smallest optimization at the diagnosed layer.
6. Repeat the matched workload.
7. Compare p50/p95 and correctness.
8. If not improved, re-diagnose once; maximum two implementation attempts.
9. Benchmark Verifier independently checks metrics and safety invariants.

## Responsible agent
Performance implementer for diagnosis/change; Benchmark Verifier for final review.

## Tools
Tracing, test environment, `scripts/dispatch_profiler.py`.

## Outputs
Baseline report, hypothesis, candidate report, comparison, safety verification.

## Checkpoints
Trace validation; baseline accepted; hypothesis recorded; matched candidate run; independent review.

## Metrics
Dispatch wait p50/p95, end-to-end p50/p95, tool duration, eager-eligible ratio, errors, ordering/security violations.

## Retry policy
Maximum two implementation attempts. Do not retry by removing approvals or guardrails.

## Stop conditions
Verified measurable improvement; dispatch wait shown immaterial; or two unsuccessful attempts.

## Failure path
Revert candidate, preserve traces, escalate to scheduler/framework owner if the bottleneck is outside application control.

## Definition of Done
Baseline measured; root cause supported by evidence; candidate implemented; matched re-measurement completed; improvement quantified; tests pass; safety boundaries preserved; independent verification completed.
