# Performance and Capacity Rules

## Purpose
Keep data workloads within latency, throughput, and capacity objectives using measured evidence.

## Scope
Ingestion, transformation, storage, queries, streaming, orchestration, and backfills.

## MUST
- Define relevant performance objectives for critical workloads.
- Base tuning decisions on measured bottlenecks using runtime metrics, query plans, profiles, or benchmarks.
- Evaluate peak and recovery load, not only average throughput.
- Capacity-test material changes that can increase data volume, concurrency, or resource demand.

## MUST NOT
- Claim a performance improvement without comparable before-and-after evidence.
- Optimize a local stage while ignoring end-to-end latency or downstream saturation.
- Run large production load tests without approved safeguards.

## SHOULD
- Preserve representative benchmark scenarios for recurring regressions.
- Track headroom for critical shared resources.

## Exceptions
Unmeasured emergency tuning requires documented symptoms, rollback criteria, and prompt follow-up validation.

## Verification
Review benchmarks, query plans, runtime metrics, saturation signals, load tests, and capacity forecasts.