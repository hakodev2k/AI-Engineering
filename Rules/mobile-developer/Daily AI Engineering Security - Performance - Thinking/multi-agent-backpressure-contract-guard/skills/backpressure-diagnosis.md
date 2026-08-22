# Skill: Backpressure Diagnosis

## Purpose
Determine whether latency/cost growth is caused by saturation, retries, queueing, or downstream failure amplification.

## Trigger
p95 latency increase, retry spike, growing queue, 429/timeout burst, or increasing model/tool calls per task.

## Inputs
Trace/events JSON, capacity policy, latency metrics, queue/in-flight metrics, retry counts, call/token usage, error classes.

## Preconditions
Use the same workload window for baseline and comparison. Correlate retries by logical task, not request ID.

## Allowed tools
Logs, traces, metrics, local analysis scripts, read-only repository inspection.

## Constraints
Do not infer saturation solely from latency. Do not modify production limits during diagnosis without approval.

## Procedure
1. Capture baseline throughput and p50/p95/p99 latency.
2. Compute retries and calls per completed logical task.
3. Plot/inspect in-flight count and queue age against latency.
4. Classify errors into transient, rate-limit, timeout, permanent, and unknown.
5. Identify whether retry volume rises after saturation begins.
6. Form one testable hypothesis: concurrency pressure, queue buildup, retry amplification, or external dependency slowdown.
7. Apply one bounded policy change in a controlled benchmark.
8. Measure again under equivalent load.

## Decision points
- If errors are permanent, stop retry optimization and fix correctness.
- If queue age rises while throughput is flat, reduce admission or increase verified capacity.
- If retries rise faster than completions, enforce retry budget/backoff.
- If no saturation correlation exists, investigate another bottleneck.

## Expected output
Baseline, hypothesis, evidence, selected policy change, post-change metrics, conclusion, residual risk.

## Metrics
Latency percentiles, throughput, queue depth/age, retries/task, calls/task, tokens/task, timeout rate.

## Verification
Improvement requires comparable load and no increase in error/correctness regressions.

## Failure handling
Maximum two tuning attempts per hypothesis; revert and escalate if neither improves target metrics.

## Stop conditions
Stop when the hypothesis is falsified, retry budget is exhausted, safety/correctness regresses, or target metrics are met.
