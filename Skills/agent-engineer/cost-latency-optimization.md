# Cost and Latency Optimization

## Purpose
Reduce agent response time and spend without degrading task quality or safety.

## When to use
Use after establishing a measured baseline or when SLO/budget targets are missed.

## Inputs
Traces, token usage, model prices, latency distributions, cacheability, evaluation scores.

## Context to inspect
Prompt size, retrieval volume, model routing, tool round trips, retries, parallelizable steps, and output length.

## Core knowledge
Optimize the critical path and expensive calls, not intuition. Smaller models, shorter context, caching, batching, and parallelism trade cost against quality, freshness, and complexity.

## Procedure
1. Establish p50/p95 latency, cost per task, and quality baseline.
2. Attribute cost and latency to each step.
3. Remove unnecessary model and tool calls.
4. Reduce irrelevant context and output verbosity.
5. Route simple tasks to cheaper/faster models when evaluations permit.
6. Parallelize independent read operations.
7. Cache stable safe-to-reuse results.
8. Bound retries and planning iterations.
9. Re-run quality and safety evaluations after each change.
10. Monitor production distributions after rollout.

## Decision points
Use caching only when staleness is acceptable. Prefer model routing when task classes can be reliably distinguished.

## Common failure patterns
Optimizing averages only, degrading hard cases, stale caches, excessive parallel calls, and ignoring retry amplification.

## Verification
Show statistically meaningful improvement in latency/cost while release-quality thresholds remain satisfied.

## Expected output
A measured optimization with before/after evidence and documented trade-offs.

## Stop conditions
Stop when further savings violate quality, safety, or freshness requirements.