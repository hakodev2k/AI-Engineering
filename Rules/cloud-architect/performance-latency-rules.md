# Performance and Latency Rules

## Purpose
Ensure cloud performance decisions are driven by measurable user and system requirements rather than assumptions.

## Scope
Applies to latency, throughput, compute, storage, databases, networking, caching, geographic placement, and performance optimization.

## MUST
- Critical user and service paths MUST define measurable latency or throughput objectives where performance affects business outcomes.
- Performance changes MUST be supported by representative before-and-after measurements.
- Architecture MUST identify latency-sensitive network, storage, database, serialization, and cross-region dependencies.
- Caching or replication used for performance MUST define consistency, invalidation, and failure behavior.

## MUST NOT
- MUST NOT claim performance improvement without comparable evidence.
- MUST NOT optimize synthetic microbenchmarks while ignoring end-to-end bottlenecks.
- MUST NOT add cross-region or multi-service hops to critical paths without evaluating latency impact.

## SHOULD
- Measure percentiles and saturation rather than averages alone.
- Optimize the dominant measured bottleneck before adding architectural complexity.

## Exceptions
Exceptions require documented constraints, expected impact, measurement limitations, and a verification plan.

## Verification
Review load tests, traces, latency percentiles, throughput metrics, saturation indicators, network paths, query plans, and benchmark methodology.