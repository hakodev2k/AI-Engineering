# Scalability and Performance Rules

## Purpose
Ensure performance and scale decisions are driven by workload evidence rather than assumptions.

## Scope
Applies to compute, storage, database, messaging, caching, network, concurrency, and external dependencies.

## MUST
- Architecture MUST define expected workload shape, concurrency, data volume, growth assumptions, and critical latency targets when scale matters.
- Performance bottlenecks MUST be measured before major optimization decisions.
- Scaling strategy MUST identify stateful bottlenecks and dependency limits, not only application replicas.
- Capacity limits and saturation signals MUST be observable.
- Performance improvements MUST use before/after evidence under representative workload.

## MUST NOT
- MUST NOT claim horizontal scalability when shared state or dependencies impose an unaddressed bottleneck.
- MUST NOT add caches, queues, or distributed services solely as speculative optimization.
- MUST NOT extrapolate benchmark results beyond their tested workload without qualification.

## SHOULD
- Prefer load tests and production telemetry for important scaling decisions.
- Design backpressure for systems that accept bursty workloads.

## Exceptions
Exploratory estimates may be used early if assumptions are clearly labeled and later validated.

## Verification
Review load tests, profiles, query plans, throughput/latency metrics, dependency quotas, capacity models, and benchmark reports.