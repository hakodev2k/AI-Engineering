# Performance and Capacity

## Purpose
Ensure database architecture meets latency, throughput, and growth requirements with evidence.

## Scope
Workload sizing, resource allocation, contention, query performance, scaling, and growth planning.

## MUST
- Performance requirements MUST define measurable latency, throughput, concurrency, and data-volume targets.
- Capacity plans MUST include growth assumptions, peak load, failure-state headroom, and scaling thresholds.
- Performance changes MUST use before/after measurement from representative workloads.
- Bottleneck claims MUST be supported by query plans, wait statistics, resource metrics, traces, or equivalent evidence.

## MUST NOT
- MUST NOT size production only from average load.
- MUST NOT claim optimization from synthetic microbenchmarks that omit dominant production constraints.
- MUST NOT scale hardware to mask an understood correctness or query-design defect without documenting the trade-off.

## SHOULD
- Prefer removing structural bottlenecks before adding sustained capacity.
- Capacity forecasts SHOULD be revisited when workload shape materially changes.

## Exceptions
Exceptions require evidence, quantified risk, expected duration, and approval when SLOs may be affected.

## Verification
Review load tests, query plans, resource metrics, forecasts, saturation trends, and post-change measurements.