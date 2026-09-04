# Latency and Performance Observability Rules

## Purpose
Ensure AI latency and throughput behavior are measured at the stages where users and operators experience it.

## Scope
Applies to end-to-end latency, model latency, retrieval latency, tool latency, queueing, streaming, throughput, and saturation.

## MUST
- User-facing AI paths MUST measure end-to-end latency and stage-level latency separately.
- Tail latency percentiles MUST be monitored for latency-sensitive workflows.
- Streaming systems MUST measure time-to-first-output and total completion time separately.
- Performance comparisons MUST use comparable workloads, traffic classes, and measurement windows.
- Capacity-sensitive components MUST expose saturation, queue depth, or equivalent pressure indicators.

## MUST NOT
- Average latency alone MUST NOT be used to declare production performance healthy.
- Performance improvement claims MUST NOT be made without before/after measurement under comparable conditions.
- Provider latency MUST NOT be conflated with total user-visible latency.

## SHOULD
- Segment latency by model, route, retrieval mode, tool usage, payload class, and fallback path when cardinality remains controlled.
- Correlate latency regressions with deployments and dependency health.

## Exceptions
Lower-resolution measurement is acceptable for low-volume paths when documented and supplemented by trace evidence.

## Verification
Inspect latency histograms, percentile dashboards, trace breakdowns, load tests, and regression reports. Reproduce at least one known slow path and confirm stage attribution is accurate.