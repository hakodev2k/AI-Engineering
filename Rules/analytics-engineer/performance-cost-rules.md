# Performance and Cost Rules

## Purpose
Ensure analytical workloads meet service expectations without unnecessary warehouse or compute cost.

## Scope
Applies to query design, materialization, partitioning, clustering, storage, concurrency, and warehouse sizing.

## MUST
- Performance or cost optimizations MUST be supported by before/after measurements under comparable conditions.
- High-cost recurring queries MUST be investigated using execution plans, scan volume, runtime, and concurrency evidence where available.
- Materialization and partitioning choices MUST consider freshness, query patterns, storage, and rebuild cost.
- Resource-heavy analytical jobs MUST have defined scheduling or concurrency behavior to avoid destabilizing critical workloads.
- Cost regressions beyond agreed thresholds MUST be attributable to specific models, workloads, or changes where tooling allows.

## MUST NOT
- MUST NOT claim optimization based on intuition alone when execution evidence is available.
- MUST NOT trade correctness for lower cost without explicit business approval.
- MUST NOT select all columns from large models when only a small subset is required for a stable production workload.

## SHOULD
- Prefer incremental or pre-aggregated strategies when measurement proves they improve total cost and latency.
- Track cost per model, domain, or workload where feasible.

## Exceptions
Exceptions require documented trade-off, evidence, duration, and accountable owner.

## Verification
Review query plans, warehouse metrics, billing data, benchmarks, scan volume, and workload history.