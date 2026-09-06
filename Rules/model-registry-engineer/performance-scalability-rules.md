# Performance and Scalability Rules

## Purpose
Keep model registration, discovery, metadata queries, and artifact retrieval performant as model count, artifact size, and automation traffic grow.

## Scope
API latency, metadata indexes, artifact transfer, concurrency, caching, pagination, storage throughput, and capacity.

## MUST
- Performance targets MUST define representative artifact sizes, model counts, query patterns, and concurrency.
- Optimization claims MUST be supported by before/after measurements.
- Large artifact operations MUST avoid loading entire files into constrained memory when streaming is practical.
- Metadata queries used by automation MUST have bounded result sets or pagination.
- Capacity limits and saturation indicators MUST be observable.

## MUST NOT
- MUST NOT optimize only synthetic microbenchmarks while ignoring end-to-end registry workflows.
- MUST NOT add caches without invalidation rules for mutable metadata and aliases.
- MUST NOT allow unbounded list or search operations on production-scale registries.

## SHOULD
- Track percentile latency, throughput, transfer failures, storage growth, and saturation.
- Use indexes based on measured query patterns.

## Exceptions
Accepted regressions require measured impact, rationale, mitigation, and approval.

## Verification
Review load tests, query plans or profiles, dashboards, memory behavior, and capacity forecasts.