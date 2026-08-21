# Performance and Scalability Leadership

## Purpose
Guide evidence-based performance work and capacity decisions across application, data, and infrastructure layers.

## When to use
Use for latency regressions, throughput limits, capacity planning, expensive workloads, or expected growth.

## Inputs
SLOs, workload profile, traces, profiles, query plans, resource metrics, benchmarks, cost data.

## Context to inspect
Inspect traffic distribution, hot paths, data volume, concurrency, caches, external calls, database behavior, and saturation points.

## Core knowledge
Performance is workload-specific. Optimize measured bottlenecks and protect correctness. Scalability can involve reducing work, batching, caching, partitioning, asynchronous processing, or adding capacity.

## Procedure
1. Define target metrics and representative workload.
2. Establish a reproducible baseline.
3. Locate dominant latency or resource consumers.
4. Separate CPU, memory, I/O, network, lock, and dependency bottlenecks.
5. Prioritize changes by expected impact and risk.
6. Test one material hypothesis at a time.
7. Compare before/after distributions, not averages alone.
8. Validate behavior under realistic concurrency.
9. Check cost and failure implications.
10. Add regression monitoring.

## Decision points
Scale up for simple bounded relief; scale out when architecture and state permit. Cache when reuse is high and consistency semantics are manageable.

## Common failure patterns
Premature optimization, microbenchmarks detached from production, hiding database issues with hardware, and ignoring tail latency.

## Verification
Measured improvement meets target without correctness regressions or unacceptable cost shifts.

## Expected output
Evidence-backed bottleneck analysis, remediation, benchmark results, and capacity guidance.

## Stop conditions
Escalate when realistic load cannot be reproduced or changes require major architectural/business trade-offs.