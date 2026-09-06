# Skill: Stream Stall Investigation

## Purpose
Diagnose whether long-tail agent latency comes from transport inactivity, semantic inactivity, retries, or legitimately slow progress.

## Trigger
Stuck streams, rising p99/max duration, unexplained retries, or user-visible tasks that remain active without useful output.

## Inputs
Timestamped event traces, request/task IDs, model/tool-call counts, timeout configuration, side-effect/idempotency metadata.

## Preconditions
Representative traces and a baseline window exist.

## Required context
Event taxonomy, task deadline, retry policy, and known side effects.

## Allowed tools
Logs/traces, included analyzer, statistics/benchmark tooling, provider SDK diagnostics.

## Constraints
Do not replay irreversible tool calls during diagnosis. Do not label heartbeat traffic as progress by default.

## Procedure
1. Capture p50/p95/p99/max task duration, completion rate, retries, model/tool calls.
2. Normalize stream events to transport-only versus semantic-progress kinds.
3. Run the watchdog over stalled and successful traces.
4. Compare semantic-gap distributions and identify a threshold above normal progressing gaps.
5. Hypothesize whether stalls are provider/network, orchestration, tool, or event-classification failures.
6. Implement the smallest bounded recovery change.
7. Measure again on the same workload distribution.
8. Independently verify completion quality and duplicate-effect rate.

## Decision points
Semantic timeout with transport activity → stalled-live stream. Transport timeout → network/provider inactivity. Overall deadline → terminate regardless of lower-level activity.

## Expected output
Baseline, classified stall evidence, hypothesis, chosen thresholds, before/after metrics, verification status.

## Metrics
p50/p95/p99/max latency, semantic-gap p95/p99, retries/task, calls/task, completion rate, duplicate side effects.

## Verification
Improvement requires lower stuck/max/p99 behavior or fewer wasted calls with no material completion/quality regression.

## Failure handling
Maximum two recovery-policy iterations. If no measurable improvement, revert and escalate with trace evidence.

## Stop conditions
Overall deadline reached, unsafe replay risk, insufficient trace evidence, or two unsuccessful optimization iterations.