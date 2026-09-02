# Performance and Capacity Rules

## Purpose
Ensure latency, throughput, and growth decisions are driven by evidence and remain sustainable under realistic workload conditions.

## Scope
Applies to platform services, storage, query engines, ingestion, batch, streaming, orchestration, and shared compute.

## MUST
- Performance objectives MUST identify measurable latency, throughput, concurrency, data-volume, and freshness targets where relevant.
- Performance claims and optimization results MUST be supported by before-and-after measurements under comparable conditions.
- Capacity planning MUST consider baseline demand, peak demand, growth, failure-mode headroom, quotas, and dependency limits.
- Bottleneck investigations MUST use telemetry, profiles, plans, traces, or equivalent evidence rather than intuition alone.
- Material capacity changes MUST define expected benefit, cost, saturation risk, and validation criteria.

## MUST NOT
- MUST NOT optimize a component while ignoring a measured downstream or upstream bottleneck that dominates end-to-end behavior.
- MUST NOT use average utilization alone to justify capacity for bursty or tail-sensitive workloads.
- MUST NOT claim scalability from a single-point benchmark that omits realistic concurrency or data size.

## SHOULD
- Prefer representative load tests and production-derived workload models.
- SHOULD maintain explicit headroom policies for critical services.

## Exceptions
Exceptions require documented measurement limitations, risk, alternative evidence, and owner approval for material production decisions.

## Verification
Review benchmarks, query plans, traces, utilization and saturation metrics, capacity forecasts, load tests, and post-change measurements.