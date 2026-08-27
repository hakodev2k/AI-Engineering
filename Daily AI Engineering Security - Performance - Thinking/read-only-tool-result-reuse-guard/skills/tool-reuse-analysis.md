# Skill: Read-Only Tool Reuse Analysis

## Purpose
Measure duplicate tool execution and determine whether result reuse is safe and performance-positive.

## Trigger
Repeated search/fetch/read calls, high tool latency, external API spend, early compaction, or long agent loops.

## Inputs
Tool trace, tool semantics, freshness requirements, task scope, output digests, baseline task metrics.

## Preconditions
Each candidate tool has a documented side-effect classification. Scope identifiers do not contain secrets.

## Required context
Representative workload, current tool policy, correctness/freshness requirements.

## Allowed tools
Read-only trace inspection, profiler script, local tests, benchmark tooling.

## Constraints
- MUST NOT cache tools with side effects.
- MUST NOT reuse across unproven tenant/user boundaries.
- MUST preserve freshness required for correctness.
- MUST establish a baseline before optimization.

## Procedure
1. Capture tool calls with normalized arguments, latency, output digest, scope, and timestamp.
2. Run the profiler to identify exact reusable duplicates.
3. Rank candidates by avoidable latency and duplicate frequency.
4. Confirm read-only semantics and freshness tolerance for the top candidate.
5. Form one hypothesis: e.g. "run-scoped 5-minute reuse eliminates repeated fetches without stale results."
6. Enable reuse for one tool.
7. Replay the representative workload.
8. Compare external calls, latency, repeated-output tokens, stale-result failures, and task success.
9. Retry with at most one TTL/scope adjustment.

## Decision points
Reject caching if state can change within the required freshness window or side effects are ambiguous.

## Expected output
Facts, Baseline, Candidate, Hypothesis, Before/After Metrics, Freshness Risks, Verification Status.

## Metrics
Duplicate rate, calls saved, avoidable latency, hit rate, stale-result failures, repeated-output tokens, task success.

## Verification
Independent Performance Verifier reviews tool semantics and reproduces before/after measurement.

## Failure handling
Disable reuse for the affected tool, restore live execution, retain evidence, and escalate ambiguous semantics.

## Stop conditions
Two failed tuning attempts, stale result affecting correctness, cross-scope ambiguity, or any side-effecting candidate.
