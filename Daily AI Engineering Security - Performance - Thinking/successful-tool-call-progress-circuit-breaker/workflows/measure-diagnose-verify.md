# Workflow: Measure, Diagnose, Verify

## Trigger
Detected repeated successful calls or high tool-call overhead.

## Goal
Reduce redundant calls with measurable evidence and preserved correctness.

## Inputs
Representative traces, task outcomes, tool classifications.

## Baseline
Record calls/task, repeated-success rate, tokens/task, median/p95 latency, and completion quality.

## Stages
1. Observe complete traces.
2. Measure baseline repeated-successful fingerprints.
3. Diagnose exact repetition, equivalent no-progress polling, and legitimate repeated checks.
4. Form one explicit root-cause hypothesis and expected measurable change.
5. Integrate the deterministic progress gate.
6. Measure the same workload again.
7. If not improved, revise the hypothesis at most twice; otherwise continue.
8. Independent verifier runs regression fixtures.

## Responsible agent
Implementation agent for integration; Performance Verifier for final verification.

## Tools
Guard script, unit tests, trace/metrics system.

## Outputs
Baseline, decision log, post-change metrics, verification decision.

## Checkpoints
After baseline, after tool classification, after first benchmark, before release.

## Retry policy
Maximum two hypothesis revisions and one implementation correction per revision.

## Stop conditions
Unknown side effects, correctness regression, or exhausted retries.

## Failure path
Disable the gate for the affected tool while keeping measurement instrumentation.

## Verification
Re-run identical workloads and compare tool calls, latency, tokens, and completion quality.

## Definition of Done
Redundant execution decreases, tests pass, no quality regression appears, and verification is independent.
