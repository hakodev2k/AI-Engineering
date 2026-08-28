# Warehouse Cost Rules

## Purpose
Control analytical platform cost while preserving service quality and correctness.

## Scope
Applies to compute, storage, scans, extracts, refreshes, materializations, and BI workload scheduling.

## MUST
- Material recurring BI workloads MUST have identifiable ownership and measurable consumption where platform telemetry allows.
- Cost optimizations MUST state expected impact on freshness, latency, concurrency, and correctness.
- Large scans or materializations MUST be justified by workload evidence when cheaper equivalent designs exist.
- Unused production assets with recurring cost MUST be reviewed for retirement.

## MUST NOT
- MUST NOT reduce retention, refresh frequency, or validation solely for cost without assessing business and compliance impact.
- MUST NOT attribute cost savings to a change without comparable usage evidence.

## SHOULD
- Workloads SHOULD use partitioning, incremental processing, workload scheduling, and reuse when these reduce cost without harming requirements.

## Exceptions
Exceptions require business rationale, cost evidence, trade-off analysis, and owner approval.

## Verification
Review billing telemetry, query history, storage usage, refresh schedules, and before-and-after cost measurements.