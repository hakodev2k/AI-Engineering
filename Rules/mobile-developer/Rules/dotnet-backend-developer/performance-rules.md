# Performance Rules

## Purpose
Ensure performance work is evidence-based, bounded, and does not sacrifice correctness or maintainability without justification.

## Scope
Applies to APIs, background jobs, database access, serialization, caching, networking, memory, and CPU usage.

## MUST
- Performance changes MUST start from a measurable symptom or requirement.
- Before/after measurements MUST use comparable conditions.
- Bottleneck claims MUST be supported by traces, profiles, query plans, metrics, or benchmarks.
- Latency-sensitive paths MUST consider database, network, serialization, allocation, and downstream dependency cost.
- Load-sensitive changes MUST consider throughput, concurrency, saturation, and backpressure.

## MUST NOT
- MUST NOT claim an optimization succeeded without measurement.
- MUST NOT trade correctness, security, or observability for performance without explicit approval.
- MUST NOT add caching or concurrency merely from intuition.

## SHOULD
- Optimize the dominant bottleneck first.
- Prefer simple changes with measurable benefit before architectural complexity.

## Exceptions
Any optimization that increases complexity materially requires documented benefit, maintenance cost, rollback path, and review.

## Verification
Use reproducible benchmarks, load tests, profiling, traces, query plans, runtime counters, and production-safe metrics.